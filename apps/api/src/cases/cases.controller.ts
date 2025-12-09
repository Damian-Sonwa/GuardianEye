import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CasesService } from './cases.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SecurityGuard } from '../auth/guards/security.guard'
import { CreateCaseDto } from './dto/create-case.dto'

@ApiTags('cases')
@Controller('cases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  @UseGuards(SecurityGuard)
  @ApiOperation({ summary: 'Create a new case (Security officers only)' })
  async createCase(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto)
  }

  @Get()
  @UseGuards(SecurityGuard)
  @ApiOperation({ summary: 'Get all cases (Security officers only)' })
  async getCases() {
    return this.casesService.findAll()
  }

  @Get(':id')
  @UseGuards(SecurityGuard)
  @ApiOperation({ summary: 'Get case by ID (Security officers only)' })
  async getCase(@Param('id') id: string) {
    return this.casesService.findOne(id)
  }
}

