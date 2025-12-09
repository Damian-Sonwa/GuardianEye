import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getAlerts() {
    // Get recent high-risk reports
    const recentReports = await this.prisma.report.findMany({
      where: {
        riskLevel: { in: ['high', 'medium'] },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return recentReports.map((report) => ({
      id: report.id,
      message: report.description.substring(0, 100),
      location: report.location,
      time: report.createdAt,
      riskLevel: report.riskLevel,
    }))
  }

  async getSafeRoutes(origin: any, destination: any) {
    // TODO: Implement route calculation based on incident reports
    // This would use a routing service (like Mapbox Directions API)
    // and avoid areas with recent high-risk incidents

    return {
      routes: [
        {
          distance: 5000,
          duration: 600,
          waypoints: [origin, destination],
        },
      ],
    }
  }
}

