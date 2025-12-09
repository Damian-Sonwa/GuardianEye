import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import FormData from 'form-data'

@Injectable()
export class AIService {
  constructor(private httpService: HttpService) {}

  async matchFace(file: Express.Multer.File) {
    try {
      const formData = new FormData()
      formData.append('image', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      })

      const faceServiceUrl = process.env.AI_FACE_SERVICE_URL || 'http://localhost:8000'
      const response = await firstValueFrom(
        this.httpService.post(`${faceServiceUrl}/match`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
      )

      return response.data
    } catch (error) {
      // Fallback if AI service is unavailable
      return {
        matches: [],
        message: 'AI service temporarily unavailable',
      }
    }
  }

  async detectWeapons(file: Express.Multer.File) {
    try {
      const formData = new FormData()
      formData.append('image', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      })

      const detectServiceUrl = process.env.AI_DETECT_SERVICE_URL || 'http://localhost:8001'
      const response = await firstValueFrom(
        this.httpService.post(`${detectServiceUrl}/detect`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
      )

      return response.data
    } catch (error) {
      return {
        detections: [],
        message: 'AI service temporarily unavailable',
      }
    }
  }

  async classifyThreat(description: string, location?: any) {
    // Simple keyword-based classification (can be enhanced with ML)
    const highRiskKeywords = ['gun', 'weapon', 'attack', 'robbery', 'assault']
    const mediumRiskKeywords = ['suspicious', 'threat', 'danger', 'fight']

    const lowerDescription = description.toLowerCase()

    if (highRiskKeywords.some((keyword) => lowerDescription.includes(keyword))) {
      return { riskLevel: 'high', confidence: 0.8 }
    }

    if (mediumRiskKeywords.some((keyword) => lowerDescription.includes(keyword))) {
      return { riskLevel: 'medium', confidence: 0.6 }
    }

    return { riskLevel: 'low', confidence: 0.4 }
  }
}

