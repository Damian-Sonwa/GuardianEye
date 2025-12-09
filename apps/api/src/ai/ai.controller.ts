import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger'
import { AIService } from './ai.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SecurityGuard } from '../auth/guards/security.guard'

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard, SecurityGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('face-match')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Match face against suspect database (Security officers only)' })
  @ApiConsumes('multipart/form-data')
  async faceMatch(@UploadedFile() file: Express.Multer.File) {
    return this.aiService.matchFace(file)
  }

  @Post('weapons')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Detect weapons in image (Security officers only)' })
  @ApiConsumes('multipart/form-data')
  async detectWeapons(@UploadedFile() file: Express.Multer.File) {
    return this.aiService.detectWeapons(file)
  }

  @Post('classify-threat')
  @ApiOperation({ summary: 'Classify incident threat level (Security officers only)' })
  async classifyThreat(@Body() body: { description: string; location?: any }) {
    return this.aiService.classifyThreat(body.description, body.location)
  }
}

