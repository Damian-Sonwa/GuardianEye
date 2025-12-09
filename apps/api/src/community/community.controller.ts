import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CommunityService } from './community.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('community')
@Controller('community')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Get community alerts (All authenticated users)' })
  async getAlerts() {
    return this.communityService.getAlerts()
  }

  @Get('safe-routes')
  @ApiOperation({ summary: 'Get safe route suggestions (All authenticated users)' })
  async getSafeRoutes(@Body() body: { origin: any; destination: any }) {
    return this.communityService.getSafeRoutes(body.origin, body.destination)
  }
}

