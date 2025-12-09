import { Controller, Post, Get, UseGuards, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InvitationCodeService } from './invitation-code.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { UserRole } from '@prisma/client'

@ApiTags('invitation-codes')
@Controller('invitation-codes')
export class InvitationCodeController {
  constructor(private invitationCodeService: InvitationCodeService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a new invitation code (Admin only)' })
  async generateCode(
    @Body() body: { role?: UserRole; expiresInDays?: number }
  ) {
    const code = await this.invitationCodeService.generateCode(
      body.role || UserRole.SECURITY_OFFICER,
      body.expiresInDays || 30
    )
    return {
      code,
      role: body.role || UserRole.SECURITY_OFFICER,
      message: 'Invitation code generated successfully',
    }
  }

  @Post('generate-dev')
  @ApiOperation({ 
    summary: 'Generate invitation code (Development only - no auth required)',
    description: '⚠️ WARNING: This endpoint should be disabled in production!'
  })
  async generateCodeDev(
    @Body() body: { role?: UserRole; expiresInDays?: number; secret?: string }
  ) {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      throw new Error('This endpoint is not available in production')
    }

    // Simple protection: require a secret key in development
    const devSecret = process.env.DEV_INVITATION_SECRET || 'dev-secret-change-me'
    if (body.secret && body.secret !== devSecret) {
      throw new Error('Invalid secret key')
    }

    const code = await this.invitationCodeService.generateCode(
      body.role || UserRole.SECURITY_OFFICER,
      body.expiresInDays || 30
    )
    return {
      code,
      role: body.role || UserRole.SECURITY_OFFICER,
      message: 'Invitation code generated successfully (dev mode)',
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all invitation codes (Admin only)' })
  async getAllCodes() {
    return this.invitationCodeService.getAllCodes()
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke an invitation code (Admin only)' })
  async revokeCode(@Body() body: { codeId: string }) {
    await this.invitationCodeService.revokeCode(body.codeId)
    return { message: 'Invitation code revoked successfully' }
  }
}


