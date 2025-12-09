import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePanicDto } from './dto/create-panic.dto'

@Injectable()
export class PanicService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePanicDto) {
    const location = dto.location ? JSON.parse(JSON.stringify(dto.location)) : null

    const alert = await this.prisma.panicAlert.create({
      data: {
        location,
        userId: dto.userId || null,
      },
    })

    // TODO: Send SMS via Termii/Africa's Talking
    // TODO: Send push notification to nearby officers

    return alert
  }
}

