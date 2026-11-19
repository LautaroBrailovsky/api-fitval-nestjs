import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StaffGuard } from './staff.guard';

// Un "contexto" falso: una petición que ya ha pasado por el AuthGuard
const context = {
  switchToHttp: () => ({ getRequest: () => ({ user: { sub: 1 } }) }),
} as unknown as ExecutionContext;

describe('StaffGuard', () => {
  // Un UsersService FALSO: findById responde lo que nosotros digamos
  const fakeUsersService = { findById: jest.fn() };
  const guard = new StaffGuard(fakeUsersService as unknown as UsersService);

  it('deja pasar al personal', async () => {
    fakeUsersService.findById.mockResolvedValue({ id: 1, role: 'staff' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('no deja pasar a un socio (403)', async () => {
    fakeUsersService.findById.mockResolvedValue({ id: 1, role: 'member' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('da 401 si el usuario ya no existe', async () => {
    fakeUsersService.findById.mockResolvedValue(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
