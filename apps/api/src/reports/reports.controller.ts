import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SecurityGuard } from '../auth/guards/security.guard'
import { CreateReportDto } from './dto/create-report.dto'

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('media'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new incident report (All authenticated users)' })
  @ApiConsumes('multipart/form-data')
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.reportsService.create(createReportDto, file)
  }

  @Get()
  @UseGuards(JwtAuthGuard, SecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports (Security officers and Admins only)' })
  async getReports(@Query('status') status?: string) {
    return this.reportsService.findAll(status)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report by ID' })
  async getReport(@Query('id') id: string) {
    return this.reportsService.findOne(id)
  }
}

