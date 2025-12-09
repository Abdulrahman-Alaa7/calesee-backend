import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      process.env.CLIENT_SIDE_DASHBOARD_URI,
      process.env.CLIENT_SIDE_DASHBOARD_URI_WWW,
      process.env.CLIENT_SIDE_URI,
      process.env.CLIENT_SIDE_URI_WWW,
    ],
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'accesstoken',
      'refreshtoken',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10000000000,
      maxFiles: 10,
      maxFieldSize: 10000000,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useStaticAssets(join(__dirname, '../..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'email-templates'));
  app.setViewEngine('ejs');

  app.use(compression());

  await app.listen(7000);
}
bootstrap();
