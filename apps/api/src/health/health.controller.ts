import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check and database connection status' })
  async healthCheck() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`
      
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        databaseUrl: process.env.DATABASE_URL 
          ? `${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'configured'}` 
          : 'not configured',
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }
}

