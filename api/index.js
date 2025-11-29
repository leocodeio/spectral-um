const path = require('path');

// Import from the compiled dist folder
const { AppModule } = require('../dist/src/app.module');
const { BootstrapConfig } = require('../dist/src/utilities/config/bootstrap.config');
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let cachedServer = null;

async function createServer() {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  const configService = app.get(ConfigService);
  const bootstrapConfig = new BootstrapConfig();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

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
  return expressApp;
}

module.exports = async function handler(req, res) {
  try {
    const server = await createServer();
    return server(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message || 'Unknown error',
    });
  }
};
