import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { PlansModule } from './plans/plans.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';
import { TrainersModule } from './trainers/trainers.module';

@Module({
  imports: [
    // Límite de peticiones por IP: 20 cada minuto
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 20 }],
      errorMessage: 'Demasiadas peticiones. Espera un poco.',
    }),
    DatabaseModule, // para que AppController pueda pedir el Pool
    PlansModule,
    ClassesModule,
    AuthModule,
    TrainersModule,
  ],
  controllers: [AppController],
  providers: [
    // Activa el límite en TODAS las rutas
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
