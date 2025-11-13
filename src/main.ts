import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers with helmet
  app.use(helmet());

  // CORS configuration
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:4200'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow tools like Postman (no origin) and local frontend origins
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, ...defaultOrigins]
        : defaultOrigins;

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`❌ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Marketfy API is running on http://localhost:${port}`);
}
bootstrap();
