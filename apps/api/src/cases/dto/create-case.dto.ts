import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCaseDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string
}

