import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthRequest } from './jwt-payload';

@Controller('auth') // rutas /api/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register') // POST /api/auth/register → 201
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login') // POST /api/auth/login → 200 (no crea nada)
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // aquí, solo 5 por minuto
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me') // GET /api/auth/me → los datos del dueño del token
  @UseGuards(AuthGuard)
  async me(@Req() request: AuthRequest) {
    // Leemos el usuario de la base de datos: así el rol siempre está al día
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe'); // → 401
    }
    return user;
  }
}
