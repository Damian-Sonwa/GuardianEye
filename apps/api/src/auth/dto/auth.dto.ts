import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ 
    required: false,
    enum: UserRole,
    description: 'Role selection: USER or SECURITY_OFFICER. ADMIN cannot be selected.'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invitationCode?: string
}

export class SecurityVerificationDto {
  // Personal Details
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dateOfBirth?: string

  // Identity documents
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  idCardUrl?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  idCardFront?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  idCardBack?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  securityIdNumber?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workIdUrl?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  policeIdUrl?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  badgeNumber?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  organization?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  department?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  licenseNumber?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  licenseUrl?: string

  // Professional Details
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  yearsOfExperience?: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rank?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  certificateUrl?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trainingCertUrl?: string

  // Additional Evidence
  @ApiProperty({ required: false })
  @IsOptional()
  additionalDocs?: any

  @ApiProperty({ required: false })
  @IsOptional()
  references?: any

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  previousEmployer?: string

  // New verification requirements
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  selfieImage?: string

  @ApiProperty({ required: false })
  @IsOptional()
  verificationQuestions?: any
}

