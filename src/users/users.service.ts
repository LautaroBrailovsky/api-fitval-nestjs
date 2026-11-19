import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseError, Pool } from 'pg';
import { toUser, User, UserRow } from './user';

@Injectable()
export class UsersService {
  constructor(private readonly pool: Pool) {}

  // Para el login: necesitamos el hash, así que devolvemos la fila entera
  async findByEmail(email: string): Promise<UserRow | undefined> {
    const result = await this.pool.query<UserRow>(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0];
  }

  // Para /me y los guards: el usuario sin el hash
  async findById(id: number): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      'SELECT id, email, password_hash, role FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] ? toUser(result.rows[0]) : undefined;
  }

  // Para el registro: el rol lo pone la base de datos ('member' por defecto)
  async create(email: string, passwordHash: string): Promise<User> {
    try {
      const result = await this.pool.query<UserRow>(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email, password_hash, role`,
        [email, passwordHash],
      );
      return toUser(result.rows[0]);
    } catch (error) {
      // 23505 = se ha roto un UNIQUE: ese email ya está registrado
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('Ya existe un usuario con ese email'); // → 409
      }
      throw error; // cualquier otro error → 500
    }
  }
}
