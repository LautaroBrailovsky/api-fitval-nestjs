import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    // registerAsync: lee JWT_SECRET cuando el .env ya está cargado
    JwtModule.registerAsync({
      global: true, // el JwtService (y el AuthGuard) sirven en todos los módulos
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' }, // el token caduca en 1 hora
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
