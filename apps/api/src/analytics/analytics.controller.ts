import { Controller, Get, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from '../auth/guards/admin.guard'

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get comprehensive analytics (Admin only)' })
  async getAnalytics() {
    return this.analyticsService.getAnalytics()
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get activity logs (Admin only)' })
  async getActivityLogs(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100
    return this.analyticsService.getActivityLogs(limitNum)
  }
}


