const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const path = require('path');

// Try multiple paths for the dist folder
let AppModule, BootstrapConfig;

try {
  // When running from api folder, dist is at ../dist
  AppModule = require('../dist/app.module').AppModule;
  BootstrapConfig = require('../dist/utilities/config/bootstrap.config').BootstrapConfig;
} catch (e1) {
  try {
    // When bundled, try relative to current directory
    AppModule = require('./dist/app.module').AppModule;
    BootstrapConfig = require('./dist/utilities/config/bootstrap.config').BootstrapConfig;
  } catch (e2) {
    try {
      // Try from project root
      AppModule = require(path.join(process.cwd(), 'dist/app.module')).AppModule;
      BootstrapConfig = require(path.join(process.cwd(), 'dist/utilities/config/bootstrap.config')).BootstrapConfig;
    } catch (e3) {
      console.error('Failed to load modules:', { e1: e1.message, e2: e2.message, e3: e3.message });
      console.error('Current directory:', process.cwd());
      console.error('__dirname:', __dirname);
      throw new Error('Cannot find app.module. Tried multiple paths.');
    }
  }
}

let cachedServer = null;
let isInitializing = false;
let initPromise = null;

async function createServer() {
  // If server is cached, return it immediately
  if (cachedServer) {
    return cachedServer;
  }

  // If initialization is in progress, wait for it
  if (isInitializing && initPromise) {
    return initPromise;
  }

  // Start initialization
  isInitializing = true;
  initPromise = (async () => {
    try {
      const expressApp = express();
      
      // Create NestJS app with Express adapter
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

      // Setup global pipes
      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: false,
        }),
      );

      // Enable versioning
      app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: configService.get('API_VERSION') || '1',
        prefix: 'v',
      });

      // Setup middleware and documentation
      bootstrapConfig.setupHelmet(app);
      bootstrapConfig.setupCors(app);
      bootstrapConfig.setupSwagger(app);

      // Initialize the app
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

// Vercel serverless function handler
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
