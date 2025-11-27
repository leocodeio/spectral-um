<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

### Vercel Deployment

This NestJS application is configured for serverless deployment on Vercel. Follow these steps to deploy:

#### Prerequisites
- A Vercel account ([sign up here](https://vercel.com/signup))
- Vercel CLI installed: `npm i -g vercel`
- A PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

#### Environment Variables

Before deploying, configure these environment variables in your Vercel project settings:

**Required Variables:**
```bash
# Application
APP_NAME=your-app-name
PORT=3000
API_VERSION=1.0
NODE_ENV=production

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
DIRECT_URL=postgresql://user:password@host:5432/database?schema=public

# API Security
APP_KEY=your-secure-api-key
SWAGGER_ROUTE=/api-docs
SWAGGER_PASSWORD=your-swagger-password

# Rate Limiting
RATE_LIMIT_POINTS=100
RATE_LIMIT_DURATION=3600
RATE_LIMIT_BLOCK_DURATION=300

# Authentication
ACCESS_TOKEN_VALIDATION_URL=https://your-auth-service.com/api/auth/get-session
AUTHORIZER_API_KEY=your-authorizer-key
CLUSTER_CLIENT_ID=your-client-id

# CORS
CORS_ORIGIN=*

# YouTube Integration (if using)
CLIENT_ID=your-google-client-id.apps.googleusercontent.com
PROJECT_ID=your-project-id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_SECRET=your-client-secret
REDIRECT_URI=https://your-domain.vercel.app/api/auth/yt/callback

# AWS S3 (if using)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_ENDPOINT=https://s3.amazonaws.com
AWS_S3_FOLDER_NAME=media

# Google Cloud Platform (if using)
GCP_PROJECT_ID=your-gcp-project-id
GCP_PRIVATE_KEY_ID=your-private-key-id
GCP_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GCP_CLIENT_ID=your-gcp-client-id
GCP_PRIVATE_KEY_B64=base64-encoded-private-key
GCP_BUCKET_LOCATION=asia-south1

# Google Drive (if using)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/v1.0/drive/oauth-callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
DRIVE_ROOT_FOLDER_NAME=spectral
```

#### Deployment Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build locally to verify (optional):**
   ```bash
   pnpm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

#### Post-Deployment

1. **Database Migrations:**
   After deployment, you may need to run Prisma migrations manually:
   ```bash
   # Set your DATABASE_URL environment variable locally
   export DATABASE_URL="your-database-url"
   
   # Run migrations
   pnpm run prisma:migrate
   ```

2. **Verify Deployment:**
   - Check your deployment URL
   - Access the Swagger documentation at `https://your-domain.vercel.app/api-docs`
   - Test health endpoint: `https://your-domain.vercel.app/health`

#### Important Notes

- The application uses serverless functions on Vercel, with cold start times on first request
- Prisma Client is generated during the build process via the `postinstall` script
- Logs are available in the Vercel dashboard
- For file uploads, ensure you configure appropriate cloud storage (AWS S3, GCP, or Google Drive)
- Database connections are pooled; ensure your PostgreSQL provider supports connection pooling

#### Troubleshooting

**Build Failures:**
- Ensure all required environment variables are set in Vercel
- Check build logs in Vercel dashboard
- Verify Prisma schema is valid: `pnpm run prisma:generate`

**Runtime Errors:**
- Check function logs in Vercel dashboard
- Verify database connectivity
- Ensure all environment variables are properly set

**API Not Responding:**
- Cold starts may take a few seconds
- Check rate limiting configuration
- Verify API key authentication

### Local Development

For local development, create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then run:
```bash
pnpm install
pnpm run prisma:generate
pnpm run dev
```

### Other Deployment Options

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
