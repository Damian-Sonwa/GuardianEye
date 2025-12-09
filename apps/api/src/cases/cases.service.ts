import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCaseDto } from './dto/create-case.dto'

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCaseDto) {
    return this.prisma.case.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'open',
        priority: dto.priority || 'medium',
        assignedTo: dto.assignedTo || null,
      },
    })
  }

  async findAll() {
    return this.prisma.case.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reports: true,
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        officer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reports: true,
      },
    })
  }
}

