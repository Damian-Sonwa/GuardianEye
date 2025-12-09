import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as crypto from 'crypto'
import { UserRole } from '@prisma/client'

@Injectable()
export class InvitationCodeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a new invitation code
   */
  async generateCode(role: UserRole = UserRole.SECURITY_OFFICER, expiresInDays: number = 30, createdBy?: string): Promise<string> {
    const code = crypto.randomBytes(16).toString('hex').toUpperCase()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    await this.prisma.invitationCode.create({
      data: {
        code,
        role,
        expiresAt,
        createdBy,
      },
    })

    return code
  }

  /**
   * Validate and use an invitation code
   */
  async validateAndUseCode(code: string, userId: string): Promise<UserRole> {
    const invitation = await this.prisma.invitationCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!invitation) {
      throw new NotFoundException('Invalid invitation code')
    }

    if (invitation.used) {
      throw new BadRequestException('Invitation code has already been used')
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation code has expired')
    }

    // Mark as used
    await this.prisma.invitationCode.update({
      where: { id: invitation.id },
      data: {
        used: true,
        usedBy: userId,
        usedAt: new Date(),
      },
    })

    return invitation.role
  }

  /**
   * Get all invitation codes (admin only)
   */
  async getAllCodes() {
    return this.prisma.invitationCode.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Revoke an invitation code
   */
  async revokeCode(codeId: string) {
    await this.prisma.invitationCode.update({
      where: { id: codeId },
      data: { used: true }, // Mark as used to prevent further use
    })
  }
}



