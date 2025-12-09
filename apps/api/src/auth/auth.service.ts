import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from '../email/email.service'
import { InvitationCodeService } from './invitation-code.service'
import { UserRole } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private invitationCodeService: InvitationCodeService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (user && user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
      // Check if email is verified (optional - you can make this required)
      if (!user.emailVerified && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
        throw new UnauthorizedException('Please verify your email before logging in')
      }
      const { passwordHash, pinHash, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    // Fetch fresh user data to get latest tokenVersion
    const freshUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!freshUser) {
      throw new UnauthorizedException('User not found')
    }

    const payload = { 
      email: freshUser.email, 
      sub: freshUser.id, 
      role: freshUser.role,
      tokenVersion: freshUser.tokenVersion,
    }
    
    // Remove sensitive data before returning
    const { passwordHash, pinHash, ...userWithoutSecrets } = freshUser
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutSecrets,
    }
  }

  async register(email: string, password: string, name?: string, role?: UserRole, invitationCode?: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException('User with this email already exists')
    }

    // Validate role selection
    let userRole: UserRole = UserRole.USER
    
    if (role === UserRole.SUPER_ADMIN) {
      // Admin can only be assigned through database, not registration
      throw new BadRequestException('Admin role cannot be assigned during registration. Please contact system administrator.')
    }
    
    if (role === UserRole.SECURITY_OFFICER) {
      // Security personnel can register but need verification
      userRole = UserRole.SECURITY_OFFICER
    } else {
      // Default to USER role
      userRole = UserRole.USER
    }

    // If invitation code is provided, validate it (legacy support)
    // Note: We'll validate after user creation to get the actual userId
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 24) // 24 hours expiry

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: name || email.split('@')[0],
        role: userRole,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    })

    // If invitation code is provided, validate and use it
    if (invitationCode) {
      try {
        const assignedRole = await this.invitationCodeService.validateAndUseCode(invitationCode, user.id)
        // Update user role if code was valid and different
        if (assignedRole !== userRole) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: { role: assignedRole },
          })
          user.role = assignedRole
          userRole = assignedRole
        }
      } catch (error) {
        // If invitation code is invalid, user keeps selected role
        console.warn('Invalid invitation code provided during registration:', error)
      }
    }

    // Send verification email
    let emailSent = false
    let verificationUrl = null
    
    try {
      const emailResult = await this.emailService.sendVerificationEmail(
        user.email,
        user.name || user.email,
        verificationToken
      )
      
      emailSent = emailResult.success
      if (!emailResult.success && emailResult.verificationUrl) {
        verificationUrl = emailResult.verificationUrl
      }
    } catch (error) {
      console.error('Failed to send verification email:', error)
      // In development, continue with registration and provide verification URL
      if (process.env.NODE_ENV === 'development') {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
        verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`
        console.log('⚠️  Email not sent. Use this verification URL:', verificationUrl)
      } else {
        // In production, you might want to handle this differently
        throw new BadRequestException('Failed to send verification email. Please try again.')
      }
    }

    const { passwordHash, pinHash, ...result } = user
    
    // For security personnel, auto-login them
    if (userRole === UserRole.SECURITY_OFFICER) {
      try {
        const loginResult = await this.login(result)
        return {
          ...loginResult,
          message: 'Registration successful. Please complete identity verification.',
          emailSent,
          verificationUrl: verificationUrl || undefined,
        }
      } catch (error) {
        // If auto-login fails, return user data anyway
        console.error('Auto-login failed for security personnel:', error)
        return {
          message: 'Registration successful. Please complete identity verification.',
          user: result,
          emailSent,
          verificationUrl: verificationUrl || undefined,
        }
      }
    }
    
    return {
      message: emailSent 
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful. Please verify your email using the link provided.',
      user: result,
      emailSent,
      verificationUrl: verificationUrl || undefined, // Only include if email wasn't sent
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
    })

    if (!user) {
      throw new BadRequestException('Invalid verification token')
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified')
    }

    if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new one.')
    }

    // Update user to verified
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    })

    const { passwordHash, ...result } = updatedUser
    return {
      message: 'Email verified successfully',
      user: result,
    }
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified')
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 24)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    })

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name || user.email,
        verificationToken
      )
      return { message: 'Verification email sent successfully' }
    } catch (error) {
      console.error('Failed to send verification email:', error)
      throw new BadRequestException('Failed to send verification email. Please try again.')
    }
  }

  async validateGoogleUser(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.emails[0].value,
          name: profile.displayName,
          role: 'USER',
          googleId: profile.id,
        },
      })
    }

    const { passwordHash, ...result } = user
    return result
  }

  async validateDeviceFingerprint(fingerprint: string) {
    // TODO: Implement device fingerprint validation
    return null
  }

  async validatePIN(userId: string, pin: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.pinHash) {
      return null
    }

    const isValid = await bcrypt.compare(pin, user.pinHash)
    if (isValid) {
      // Return user with latest tokenVersion
      const { passwordHash, pinHash, ...result } = user
      return result
    }

    return null
  }

  async setupPIN(userId: string, pin: string) {
    // Check if user is verified security personnel
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Only allow PIN setup for verified security personnel
    if (user.role === 'SECURITY_OFFICER') {
      // Check verification status
      const verification = await this.prisma.securityVerification.findUnique({
        where: { userId },
      })
      
      if (!verification || verification.status !== 'approved') {
        throw new BadRequestException('You must be verified before setting up PIN')
      }
    }

    const pinHash = await bcrypt.hash(pin, 10)
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { pinHash },
    })

    return { message: 'PIN set successfully' }
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Update user role (Admin only)
   * Can only assign USER or SECURITY_OFFICER, not SUPER_ADMIN
   */
  async updateUserRole(userId: string, newRole: UserRole) {
    // Prevent assigning SUPER_ADMIN role from dashboard
    if (newRole === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('SUPER_ADMIN role can only be assigned directly from the database')
    }

    // Validate role
    if (newRole !== UserRole.USER && newRole !== UserRole.SECURITY_OFFICER) {
      throw new BadRequestException('Invalid role. Only USER and SECURITY_OFFICER roles can be assigned')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Prevent changing SUPER_ADMIN role
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot modify SUPER_ADMIN role')
    }

    // Increment tokenVersion to invalidate all existing tokens for this user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { 
        role: newRole,
        tokenVersion: { increment: 1 }, // Invalidate all existing tokens
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return updatedUser
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Prevent deleting SUPER_ADMIN
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot delete SUPER_ADMIN user')
    }

    await this.prisma.user.delete({
      where: { id: userId },
    })

    return { message: 'User deleted successfully' }
  }

  /**
   * Suspend or reactivate user account (Admin only)
   * Note: This would require adding an 'active' or 'suspended' field to the User model
   * For now, we'll use a simple approach with a note field or we can add it to the schema later
   */
  async suspendUser(userId: string, suspended: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Prevent suspending SUPER_ADMIN
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot suspend SUPER_ADMIN user')
    }

    // Note: This would require adding a 'suspended' or 'active' field to the User model
    // For now, we'll return a message indicating this feature needs schema update
    // In a real implementation, you'd update the user with: data: { suspended: !suspended }
    
    return { 
      message: suspended ? 'User suspended' : 'User reactivated',
      note: 'Suspension feature requires adding a "suspended" field to the User model'
    }
  }
}

