import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get comprehensive analytics for admin dashboard
   */
  async getAnalytics() {
    // Total reports
    const totalReports = await this.prisma.report.count()
    
    // Reports by status
    const reportsByStatus = await this.prisma.report.groupBy({
      by: ['riskLevel'],
      _count: true,
    })

    // Resolved vs unresolved (using cases)
    const totalCases = await this.prisma.case.count()
    const resolvedCases = await this.prisma.case.count({
      where: { status: 'closed' },
    })
    const unresolvedCases = totalCases - resolvedCases

    // Reports by date (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentReports = await this.prisma.report.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        location: true,
        createdAt: true,
        riskLevel: true,
      },
    })

    // User statistics
    const totalUsers = await this.prisma.user.count()
    const securityOfficers = await this.prisma.user.count({
      where: { role: 'SECURITY_OFFICER' },
    })
    const regularUsers = await this.prisma.user.count({
      where: { role: 'USER' },
    })
    const admins = await this.prisma.user.count({
      where: { role: 'SUPER_ADMIN' },
    })

    // Verification statistics
    const pendingVerifications = await this.prisma.securityVerification.count({
      where: { status: 'pending' },
    })
    const approvedVerifications = await this.prisma.securityVerification.count({
      where: { status: 'approved' },
    })
    const rejectedVerifications = await this.prisma.securityVerification.count({
      where: { status: 'rejected' },
    })

    // Panic alerts
    const totalPanicAlerts = await this.prisma.panicAlert.count()
    const recentPanicAlerts = await this.prisma.panicAlert.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Extract locations for heatmap
    const locations = recentReports
      .filter((r) => r.location)
      .map((r) => {
        const loc = r.location as any
        return {
          lat: loc.lat,
          lng: loc.lng,
          riskLevel: r.riskLevel || 'medium',
          timestamp: r.createdAt,
        }
      })

    return {
      reports: {
        total: totalReports,
        byRiskLevel: reportsByStatus.reduce((acc, item) => {
          acc[item.riskLevel || 'unknown'] = item._count
          return acc
        }, {} as Record<string, number>),
        recent: recentReports.length,
      },
      cases: {
        total: totalCases,
        resolved: resolvedCases,
        unresolved: unresolvedCases,
        resolutionRate: totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0,
      },
      users: {
        total: totalUsers,
        securityOfficers,
        regularUsers,
        admins,
      },
      verifications: {
        pending: pendingVerifications,
        approved: approvedVerifications,
        rejected: rejectedVerifications,
      },
      panicAlerts: {
        total: totalPanicAlerts,
        recent: recentPanicAlerts,
      },
      heatmap: {
        locations,
        totalLocations: locations.length,
      },
      timeRange: {
        start: thirtyDaysAgo.toISOString(),
        end: new Date().toISOString(),
      },
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(limit: number = 100) {
    return this.prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      // Note: ActivityLog doesn't have user relation, so we just return the userId field
    })
  }
}

