import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { BootstrapConfig } from '../src/utilities/config/bootstrap.config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

async function createServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
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
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await createServer();
  return server(req, res);
}
