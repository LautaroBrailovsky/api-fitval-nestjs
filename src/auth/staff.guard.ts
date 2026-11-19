import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

// Va DESPUÉS del AuthGuard: ya sabemos quién es, ¿es personal del gimnasio?
@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // El rol se lee de la base de datos en cada petición, no del token
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe'); // → 401
    }
    if (user.role !== 'staff') {
      throw new ForbiddenException('Solo para el personal del gimnasio'); // → 403
    }
    return true;
  }
}
