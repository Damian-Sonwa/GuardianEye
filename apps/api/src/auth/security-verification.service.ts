import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SecurityVerificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit verification documents for security personnel
   */
  async submitVerification(userId: string, data: {
    // Personal Details
    fullName?: string
    phoneNumber?: string
    address?: string
    dateOfBirth?: string
    // Identity documents
    idCardUrl?: string
    idCardFront?: string
    idCardBack?: string
    securityIdNumber?: string
    workIdUrl?: string
    policeIdUrl?: string
    badgeNumber?: string
    organization?: string
    department?: string
    licenseNumber?: string
    licenseUrl?: string
    // Professional Details
    yearsOfExperience?: number
    rank?: string
    certificateUrl?: string
    trainingCertUrl?: string
    // Additional Evidence
    additionalDocs?: any
    references?: any
    previousEmployer?: string
    // New verification requirements
    selfieImage?: string
    verificationQuestions?: any
    // Legacy
    documents?: any
  }) {
    // Check if user exists and has SECURITY_OFFICER role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.role !== 'SECURITY_OFFICER') {
      throw new BadRequestException('Only security personnel can submit verification')
    }

    // Check if verification already exists
    const existing = await this.prisma.securityVerification.findUnique({
      where: { userId },
    })

    if (existing && existing.status === 'approved') {
      throw new BadRequestException('User is already verified')
    }

    // Prepare data for database, converting dateOfBirth string to Date if provided
    const verificationData: any = {
      ...data,
      status: 'pending',
    }

    // Convert dateOfBirth string to Date if provided
    if (data.dateOfBirth) {
      verificationData.dateOfBirth = new Date(data.dateOfBirth)
    }

    // Create or update verification
    const verification = await this.prisma.securityVerification.upsert({
      where: { userId },
      create: {
        userId,
        ...verificationData,
      },
      update: {
        ...verificationData,
        verifiedBy: null,
        verifiedAt: null,
        rejectionReason: null,
      },
    })

    return verification
  }

  /**
   * Get verification status for a user
   */
  async getVerificationStatus(userId: string) {
    const verification = await this.prisma.securityVerification.findUnique({
      where: { userId },
    })

    return verification
  }

  /**
   * Approve verification (Admin only)
   */
  async approveVerification(userId: string, verifiedBy: string, notes?: string) {
    const verification = await this.prisma.securityVerification.findUnique({
      where: { userId },
    })

    if (!verification) {
      throw new NotFoundException('Verification not found')
    }

    if (verification.status === 'approved') {
      throw new BadRequestException('Verification already approved')
    }

    const updated = await this.prisma.securityVerification.update({
      where: { userId },
      data: {
        status: 'approved',
        verifiedBy,
        verifiedAt: new Date(),
        notes,
        rejectionReason: null,
      },
    })

    return updated
  }

  /**
   * Reject verification (Admin only)
   */
  async rejectVerification(userId: string, verifiedBy: string, reason: string) {
    const verification = await this.prisma.securityVerification.findUnique({
      where: { userId },
    })

    if (!verification) {
      throw new NotFoundException('Verification not found')
    }

    const updated = await this.prisma.securityVerification.update({
      where: { userId },
      data: {
        status: 'rejected',
        verifiedBy,
        verifiedAt: new Date(),
        rejectionReason: reason,
      },
    })

    // Optionally revoke security role if rejected
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' },
    })

    return updated
  }

  /**
   * Get all pending verifications (Admin only)
   */
  async getPendingVerifications() {
    return this.prisma.securityVerification.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Check if user is verified
   */
  async isVerified(userId: string): Promise<boolean> {
    const verification = await this.prisma.securityVerification.findUnique({
      where: { userId },
    })

    return verification?.status === 'approved'
  }
}


