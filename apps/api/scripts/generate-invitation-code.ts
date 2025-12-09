/**
 * Script to generate invitation codes for security personnel
 * 
 * Usage:
 *   npx ts-node scripts/generate-invitation-code.ts
 *   npx ts-node scripts/generate-invitation-code.ts SECURITY_OFFICER 60
 */

import { PrismaClient, UserRole } from '@prisma/client'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

async function generateInvitationCode(
  role: UserRole = UserRole.SECURITY_OFFICER,
  expiresInDays: number = 30
) {
  const code = crypto.randomBytes(16).toString('hex').toUpperCase()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const invitation = await prisma.invitationCode.create({
    data: {
      code,
      role,
      expiresAt,
    },
  })

  console.log('\n✅ Invitation code generated successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Code: ${code}`)
  console.log(`Role: ${role}`)
  console.log(`Expires: ${expiresAt.toLocaleDateString()}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\nShare this code with the person who should register as security personnel.')
  console.log('They should enter this code during registration.\n')

  return invitation
}

async function main() {
  const args = process.argv.slice(2)
  const role = (args[0] as UserRole) || UserRole.SECURITY_OFFICER
  const expiresInDays = parseInt(args[1]) || 30

  try {
    await generateInvitationCode(role, expiresInDays)
  } catch (error) {
    console.error('Error generating invitation code:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()



