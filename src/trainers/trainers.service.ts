import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseError, Pool } from 'pg';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { Trainer, TrainerRow, toTrainer } from './trainer';

@Injectable()
export class TrainersService {
  constructor(private readonly pool: Pool) {}

  // GET /api/v1/trainers/:id → el monitor con sus especialidades
  async findOne(id: number): Promise<Trainer> {
    // JOIN de las tres tablas: una fila por especialidad
    const result = await this.pool.query<TrainerRow>(
      `SELECT t.id, t.name, t.email, t.photo_url, s.name AS specialty
       FROM trainers t
       JOIN trainer_specialties ts ON ts.trainer_id = t.id
       JOIN specialties s ON s.id = ts.specialty_id
       WHERE t.id = $1
       ORDER BY s.id`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`No existe ningún monitor con id ${id}`); // → 404
    }
    return toTrainer(result.rows); // varias filas → un monitor
  }

  // POST /api/v1/trainers → el monitor y sus especialidades, todo o nada
  async create(dto: CreateTrainerDto): Promise<Trainer> {
    // Una transacción tiene que ir SIEMPRE por la misma conexión:
    // pedimos una al Pool y la usamos para todo.
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // empieza la transacción

      const trainer = await client.query<{ id: number }>(
        `INSERT INTO trainers (dni, name, email)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [dto.dni, dto.name, dto.email],
      );
      const trainerId = trainer.rows[0].id;

      for (const specialtyId of dto.specialtyIds) {
        // ¿Existe la especialidad? El id llega en el body → 400
        const specialty = await client.query(
          'SELECT id FROM specialties WHERE id = $1',
          [specialtyId],
        );
        if (specialty.rows.length === 0) {
          throw new BadRequestException(
            `No existe la especialidad ${specialtyId}`,
          );
        }

        await client.query(
          `INSERT INTO trainer_specialties (trainer_id, specialty_id)
           VALUES ($1, $2)`,
          [trainerId, specialtyId],
        );
      }

      await client.query('COMMIT'); // todo ha ido bien: se guarda
      return this.findOne(trainerId);
    } catch (error) {
      await client.query('ROLLBACK'); // algo ha fallado: se deshace todo

      // 23505 = se ha roto un UNIQUE: el DNI o el correo ya existen
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException(
          'Ya existe un monitor con ese DNI o correo',
        ); // → 409
      }
      throw error; // y el error sigue su camino (400, 500...)
    } finally {
      client.release(); // devolvemos la conexión al Pool, pase lo que pase
    }
  }

  // Guarda la dirección de la foto y devuelve el monitor completo
  async setPhoto(id: number, photoUrl: string): Promise<Trainer> {
    await this.pool.query('UPDATE trainers SET photo_url = $1 WHERE id = $2', [
      photoUrl,
      id,
    ]);
    return this.findOne(id);
  }
}
