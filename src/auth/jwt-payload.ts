import { Request } from 'express';

// Lo que va dentro del token: SOLO el id del usuario
export interface JwtPayload {
  sub: number;
}

// Una petición que ya ha pasado por el AuthGuard
export interface AuthRequest extends Request {
  user: JwtPayload;
}
