import { Controller, Post, Body, UseGuards, Get, Req, Query, Put, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { UserRole } from '@prisma/client'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    )
    if (!user) {
      throw new Error('Invalid credentials')
    }
    return this.authService.login(user)
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.role,
      registerDto.invitationCode
    )
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address (GET)' })
  async verifyEmailGet(@Query('token') token: string) {
    if (!token) {
      throw new Error('Verification token is required')
    }
    return this.authService.verifyEmail(token)
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address (POST)' })
  async verifyEmailPost(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token)
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email)
  }

  @Post('google')
  @ApiOperation({ summary: 'Login with Google OAuth' })
  async googleLogin(@Body() body: { token: string }) {
    // TODO: Verify Google token and get user profile
    return { message: 'Google login not yet implemented' }
  }

  @Post('fingerprint')
  @ApiOperation({ summary: 'Login with device fingerprint' })
  async fingerprintLogin(@Body() body: { fingerprint: string }) {
    const user = await this.authService.validateDeviceFingerprint(
      body.fingerprint
    )
    if (!user) {
      throw new Error('Invalid fingerprint')
    }
    return this.authService.login(user)
  }

  @Post('pin')
  @ApiOperation({ summary: 'Login with 4-digit PIN' })
  async pinLogin(@Body() body: { userId: string; pin: string }) {
    const user = await this.authService.validatePIN(body.userId, body.pin)
    if (!user) {
      throw new Error('Invalid PIN')
    }
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    // Return user without sensitive data, including tokenVersion
    const { passwordHash, pinHash, ...user } = req.user
    return user
  }

  @Post('setup-pin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set up PIN for quick login (Verified security personnel only)' })
  async setupPIN(@Req() req, @Body() body: { pin: string }) {
    if (!body.pin || body.pin.length !== 4) {
      throw new Error('PIN must be 4 digits')
    }
    return this.authService.setupPIN(req.user.id, body.pin)
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getAllUsers() {
    return this.authService.getAllUsers()
  }

  @Put('users/:userId/role')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only, cannot assign SUPER_ADMIN)' })
  async updateUserRole(@Param('userId') userId: string, @Body() body: { role: UserRole }) {
    return this.authService.updateUserRole(userId, body.role)
  }

  @Delete('users/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only, cannot delete SUPER_ADMIN)' })
  async deleteUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId)
  }

  @Put('users/:userId/suspend')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend or reactivate user (Admin only)' })
  async suspendUser(@Param('userId') userId: string, @Body() body: { suspended: boolean }) {
    return this.authService.suspendUser(userId, body.suspended)
  }
}
