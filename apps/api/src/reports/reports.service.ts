import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReportDto } from './dto/create-report.dto'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReportDto, file?: Express.Multer.File) {
    let mediaUrl: string | null = null

    if (file) {
      // TODO: Upload to S3-compatible storage
      const uploadDir = path.join(process.cwd(), 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.originalname}`
      const filepath = path.join(uploadDir, filename)
      fs.writeFileSync(filepath, file.buffer)
      mediaUrl = `/uploads/${filename}`
    }

    const location = dto.location ? JSON.parse(dto.location) : null

    return this.prisma.report.create({
      data: {
        description: dto.description,
        location,
        mediaUrl,
        mediaType: file?.mimetype?.split('/')[0] || null,
        anonymous: dto.anonymous !== 'false',
        userId: dto.userId || null,
      },
    })
  }

  async findAll(status?: string) {
    return this.prisma.report.findMany({
      where: status ? { riskLevel: status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }
}

