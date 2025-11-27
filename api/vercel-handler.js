const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

// Import from compiled dist folder (handler is in dist/api/, modules are in dist/)
const { AppModule } = require('../app.module');
const { BootstrapConfig } = require('../utilities/config/bootstrap.config');

let cachedServer = null;
let isInitializing = false;
let initPromise = null;

async function createServer() {
  if (cachedServer) {
    return cachedServer;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      const expressApp = express();
      
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
          logger: ['error', 'warn', 'log'],
          abortOnError: false,
        },
      );

      const configService = app.get(ConfigService);
      const bootstrapConfig = new BootstrapConfig();

      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: false,
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
    } catch (error) {
      console.error('Failed to initialize NestJS app:', error);
      throw error;
    } finally {
      isInitializing = false;
      initPromise = null;
    }
  })();

  return initPromise;
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
