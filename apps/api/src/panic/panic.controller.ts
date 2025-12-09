import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PanicService } from './panic.service'
import { CreatePanicDto } from './dto/create-panic.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('panic')
@Controller('panic')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PanicController {
  constructor(private panicService: PanicService) {}

  @Post()
  @ApiOperation({ summary: 'Send panic alert (All authenticated users)' })
  async createPanic(@Body() createPanicDto: CreatePanicDto) {
    return this.panicService.create(createPanicDto)
  }
}

