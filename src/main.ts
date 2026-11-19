import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { configureApp } from './app.config';
import { AppModule } from './app.module';

// En tu ordenador, lee el .env. En Render no hay .env: las variables las pone Render.
if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app); // prefijo /api y validación
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
