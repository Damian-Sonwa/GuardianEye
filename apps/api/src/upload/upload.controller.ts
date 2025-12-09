import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file (All authenticated users)' })
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname)
    const filename = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    fs.writeFileSync(filepath, file.buffer)

    // Return URL (in production, this would be a CDN URL)
    const url = `/uploads/${filename}`
    
    return {
      url,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }
  }
}

