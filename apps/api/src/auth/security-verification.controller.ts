import { Controller, Post, Get, UseGuards, Body, Param, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SecurityVerificationService } from './security-verification.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { SecurityGuard } from './guards/security.guard'
import { SecurityVerificationDto } from './dto/auth.dto'

@ApiTags('security-verification')
@Controller('security-verification')
export class SecurityVerificationController {
  constructor(private verificationService: SecurityVerificationService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard, SecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit verification documents (Security personnel only)' })
  async submitVerification(@Req() req, @Body() dto: SecurityVerificationDto) {
    return this.verificationService.submitVerification(req.user.id, dto)
  }

  @Get('status')
  @UseGuards(JwtAuthGuard, SecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get verification status (Security personnel only)' })
  async getStatus(@Req() req) {
    return this.verificationService.getVerificationStatus(req.user.id)
  }

  @Post('approve/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve verification (Admin only)' })
  async approve(@Param('userId') userId: string, @Req() req, @Body() body: { notes?: string }) {
    return this.verificationService.approveVerification(userId, req.user.id, body.notes)
  }

  @Post('reject/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject verification (Admin only)' })
  async reject(@Param('userId') userId: string, @Req() req, @Body() body: { reason: string }) {
    return this.verificationService.rejectVerification(userId, req.user.id, body.reason)
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending verifications (Admin only)' })
  async getPending() {
    return this.verificationService.getPendingVerifications()
  }
}


