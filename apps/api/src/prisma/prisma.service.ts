import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    try {
      await this.$connect()
      
      // Extract database info from connection string for logging
      const dbUrl = process.env.DATABASE_URL || ''
      let dbInfo = 'Unknown database'
      
      if (dbUrl) {
        try {
          // Parse connection string to show database info
          const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/)
          if (urlMatch) {
            const [, user, , host, port, database] = urlMatch
            dbInfo = `${database}@${host}:${port} (user: ${user})`
          } else {
            // Fallback: show host if available
            const hostMatch = dbUrl.match(/@([^:]+):(\d+)/)
            if (hostMatch) {
              dbInfo = `${hostMatch[1]}:${hostMatch[2]}`
            }
          }
        } catch (e) {
          // If parsing fails, just show that connection string exists
          dbInfo = 'Database connection configured'
        }
      }
      
      this.logger.log(`✅ Database connection successful!`)
      this.logger.log(`📊 Connected to: ${dbInfo}`)
      
      // Test query to verify connection
      await this.$queryRaw`SELECT 1 as test`
      this.logger.log(`✅ Database query test passed`)
    } catch (error) {
      this.logger.error(`❌ Database connection failed: ${error.message}`)
      throw error
    }
  }
}

