import { IsOptional, IsObject, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePanicDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  location?: { lat: number; lng: number }

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string
}

