import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Apollo-Require-Preflight',
      'accesstoken',
      'refreshtoken',
    ],
  });

  app.use(cookieParser());

  app.use(
    graphqlUploadExpress({
      maxFileSize: MAX_FILE_SIZE,
      maxFiles: 10,
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '../..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'email-templates'));
  app.setViewEngine('ejs');

  app.use(compression());

  await app.listen(7000);
}
bootstrap();
