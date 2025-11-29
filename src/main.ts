import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { BootstrapConfig } from './utilities/config/bootstrap.config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Application } from 'express';

let cachedApp: Application | null = null;

async function createApp(): Promise<Application> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn', 'log'],
  });
  const configService = app.get(ConfigService);
  const bootstrapConfig = new BootstrapConfig();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('API_VERSION') || '1',
    prefix: 'v',
  });

  bootstrapConfig.setupHelmet(app);
  bootstrapConfig.setupCors(app);
  bootstrapConfig.setupSwagger(app);

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}

// Standalone server mode (for local development)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const bootstrapConfig = new BootstrapConfig();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('API_VERSION'),
    prefix: 'v',
  });

  bootstrapConfig.setupHelmet(app);
  bootstrapConfig.setupCors(app);
  bootstrapConfig.setupSwagger(app);

  console.log('application running on port', configService.get('PORT'));
  await app.listen(configService.get('PORT') || 3000);
}

// Only run bootstrap if this is the main module (not imported by Vercel)
if (require.main === module) {
  bootstrap();
}
