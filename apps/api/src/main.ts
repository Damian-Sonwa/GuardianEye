import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  
  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  })

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Security App API')
    .setDescription('API for Security App - Bandit Tracking & Safety')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 API server running on http://localhost:${port}`)
  console.log(`📚 Swagger docs available at http://localhost:${port}/api`)
  
  // Log environment configuration
  console.log(`\n📋 Environment Configuration:`)
  console.log(`   - Database: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`   - JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`   - Email Provider: ${process.env.EMAIL_PROVIDER || 'smtp (default)'}`)
  console.log(`   - SMTP User: ${process.env.SMTP_USER || process.env.EMAIL_USER || '❌ Not configured'}`)
  console.log(`   - Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
}

bootstrap()

