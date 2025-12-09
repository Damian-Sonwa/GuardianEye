import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { InvitationCodeController } from './invitation-code.controller'
import { SecurityVerificationController } from './security-verification.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { InvitationCodeService } from './invitation-code.service'
import { SecurityVerificationService } from './security-verification.service'
import { PrismaModule } from '../prisma/prisma.module'
import { EmailModule } from '../email/email.module'

// Conditionally include GoogleStrategy only if credentials are provided
const providers: any[] = [
  AuthService,
  JwtStrategy,
  InvitationCodeService,
  SecurityVerificationService,
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleStrategy)
}

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, InvitationCodeController, SecurityVerificationController],
  providers,
  exports: [AuthService, InvitationCodeService],
})
export class AuthModule {}

