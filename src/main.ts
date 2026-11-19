import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureApp } from './app.config';
import { AppModule } from './app.module';

// En tu ordenador, lee el .env. En Render no hay .env: las variables las pone Render.
if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Render, las peticiones llegan a través de un proxy:
  // así Express ve la IP de verdad de cada cliente
  app.set('trust proxy', 1);

  configureApp(app); // prefijo /api y validación
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
