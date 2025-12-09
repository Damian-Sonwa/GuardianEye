import { Module } from '@nestjs/common'
import { PanicController } from './panic.controller'
import { PanicService } from './panic.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PanicController],
  providers: [PanicService],
})
export class PanicModule {}

