'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Users, Shield, User, ArrowLeft, Loader2, Edit2, Check, X, UserPlus, Eye, EyeOff } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'

type UserRole = 'USER' | 'SECURITY_OFFICER' | 'SUPER_ADMIN' | 'COMMUNITY_ADMIN'

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export default function UsersManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  // Create user modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createConfirmPassword, setCreateConfirmPassword] = useState('')
  const [createRole, setCreateRole] = useState<UserRole>('USER')
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false)
  const [creating, setCreating] = useState(false)

  // Only admins can access
  useRoleGuard(['SUPER_ADMIN'])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (user: User) => {
    setEditingUserId(user.id)
    setSelectedRole(user.role)
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setSelectedRole(null)
  }

  const handleUpdateRole = async (userId: string) => {
    if (!selectedRole) return

    // Prevent assigning SUPER_ADMIN
    if (selectedRole === 'SUPER_ADMIN') {
      alert('SUPER_ADMIN role can only be assigned directly from the database')
      return
    }

    // Only allow USER or SECURITY_OFFICER
    if (selectedRole !== 'USER' && selectedRole !== 'SECURITY_OFFICER') {
      alert('Only USER and SECURITY_OFFICER roles can be assigned from the dashboard')
      return
    }

    setProcessing(userId)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (response.ok) {
        alert('User role updated successfully!')
        setEditingUserId(null)
        setSelectedRole(null)
        loadUsers()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    } finally {
      setProcessing(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    setProcessing(userId)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert('User deleted successfully')
        loadUsers()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    } finally {
      setProcessing(null)
      setShowDeleteConfirm(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!createName || !createEmail || !createPassword || !createConfirmPassword) {
      alert('Please fill in all fields')
      return
    }

    if (createPassword !== createConfirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (createPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setCreating(true)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: createPassword,
          role: createRole,
        }),
      })

      if (response.ok) {
        alert('User created successfully!')
        setShowCreateModal(false)
        setCreateName('')
        setCreateEmail('')
        setCreatePassword('')
        setCreateConfirmPassword('')
        setCreateRole('USER')
        loadUsers()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'SECURITY_OFFICER':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'COMMUNITY_ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="h-4 w-4" />
      case 'SECURITY_OFFICER':
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="active:scale-95">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold">User Management</h1>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="active:scale-95"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Info Card */}
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    Role Assignment Rules
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You can assign <strong>USER</strong> or <strong>SECURITY_OFFICER</strong> roles from this dashboard. 
                    <strong> SUPER_ADMIN</strong> role can only be assigned directly from the database for security reasons.
                    You can also delete users (except SUPER_ADMIN).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                          {user.name || 'No Name'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                        {user.emailVerified ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            Unverified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {user.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRole || user.role}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            disabled={user.role === 'SUPER_ADMIN'}
                            className="px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                          >
                            <option value="USER">USER</option>
                            <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                            {user.role === 'SUPER_ADMIN' && (
                              <option value="SUPER_ADMIN" disabled>SUPER_ADMIN (Database Only)</option>
                            )}
                          </select>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateRole(user.id)}
                            disabled={processing === user.id || selectedRole === user.role || selectedRole === 'SUPER_ADMIN'}
                            className="h-9"
                          >
                            {processing === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={processing === user.id}
                            className="h-9"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRole(user)}
                            disabled={user.role === 'SUPER_ADMIN' || processing === user.id}
                            className="h-9 active:scale-95"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            {user.role === 'SUPER_ADMIN' ? 'Cannot Edit' : 'Edit Role'}
                          </Button>
                          {user.role !== 'SUPER_ADMIN' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={processing === user.id}
                              className="h-9 active:scale-95"
                            >
                              {processing === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {users.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  No Users Found
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  There are no users in the system yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 rounded-2xl">
            <CardHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Create New User</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCreateModal(false)
                    setCreateName('')
                    setCreateEmail('')
                    setCreatePassword('')
                    setCreateConfirmPassword('')
                    setCreateRole('USER')
                  }}
                  className="active:scale-95"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="USER">USER</option>
                    <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? 'text' : 'password'}
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pr-10"
                      placeholder="Enter password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showCreatePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showCreateConfirmPassword ? 'text' : 'password'}
                      value={createConfirmPassword}
                      onChange={(e) => setCreateConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pr-10"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreateConfirmPassword(!showCreateConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showCreateConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false)
                      setCreateName('')
                      setCreateEmail('')
                      setCreatePassword('')
                      setCreateConfirmPassword('')
                      setCreateRole('USER')
                    }}
                    disabled={creating}
                    className="flex-1 active:scale-95"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 active:scale-95"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


