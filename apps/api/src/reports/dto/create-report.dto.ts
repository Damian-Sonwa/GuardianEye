import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  anonymous?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string
}

