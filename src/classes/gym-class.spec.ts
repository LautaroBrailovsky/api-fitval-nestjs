import { GymClassRow, toGymClass } from './gym-class';

describe('toGymClass', () => {
  // Una fila como las que devuelve PostgreSQL
  const row: GymClassRow = {
    id: 1,
    activity: 'Spinning',
    room: 'Sala 1',
    starts_at: new Date('2026-11-02T09:00:00Z'),
    spots: 12,
    trainer_name: 'Carla Navarro',
  };

  it('convierte una fila de la base de datos en una clase de la API', () => {
    // 1. Ejecutar
    const gymClass = toGymClass(row);

    // 2. Comprobar
    expect(gymClass).toEqual({
      id: 1,
      activity: 'Spinning',
      room: 'Sala 1',
      startsAt: new Date('2026-11-02T09:00:00Z'),
      spots: 12,
      trainerName: 'Carla Navarro',
    });
  });

  it('no deja pasar los nombres de columna de la base de datos', () => {
    const gymClass = toGymClass(row);

    expect(gymClass).not.toHaveProperty('starts_at');
    expect(gymClass).not.toHaveProperty('trainer_name');
  });
});
