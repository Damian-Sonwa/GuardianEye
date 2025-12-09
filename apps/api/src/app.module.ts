import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ReportsModule } from './reports/reports.module'
import { CasesModule } from './cases/cases.module'
import { PanicModule } from './panic/panic.module'
import { CommunityModule } from './community/community.module'
import { AIModule } from './ai/ai.module'
import { HealthModule } from './health/health.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { UploadController } from './upload/upload.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ReportsModule,
    CasesModule,
    PanicModule,
    CommunityModule,
    AIModule,
    HealthModule,
    AnalyticsModule,
  ],
  controllers: [UploadController],
})
export class AppModule {}

