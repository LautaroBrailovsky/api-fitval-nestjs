import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { ClassesService } from './classes.service';

// Una fila de clase como la devuelve el JOIN. La usarás en varios tests
const spinningRow = {
  id: 1,
  activity: 'Spinning',
  room: 'Sala 1',
  starts_at: new Date('2026-11-02T09:00:00Z'),
  spots: 12,
  trainer_name: 'Carla Navarro',
};

// El body de una clase nueva (el del Ejercicio 4.1)
const newClass = {
  activity: 'Fuerza',
  room: 'Sala 3',
  startsAt: '2026-11-10T18:00:00Z',
  spots: 15,
  trainerId: 99,
};

describe('ClassesService', () => {
  // Un Pool FALSO: tiene un método query, pero no habla con PostgreSQL
  const fakePool = { query: jest.fn() };
  const service = new ClassesService(fakePool as unknown as Pool);

  beforeEach(() => {
    fakePool.query.mockReset(); // antes de cada test, el falso empieza de cero
  });

  it('findOne lanza un 404 si no hay ninguna fila', async () => {
    fakePool.query.mockResolvedValue({ rows: [] }); // "la base de datos no encuentra nada"

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('findOne devuelve la clase convertida si la encuentra', async () => {
    fakePool.query.mockResolvedValue({ rows: [spinningRow] });

    const gymClass = await service.findOne(1);

    expect(gymClass.trainerName).toBe('Carla Navarro');
    expect(gymClass.startsAt).toEqual(new Date('2026-11-02T09:00:00Z'));
  });

  it('create con un monitor que no existe lanza 400 y no hace el INSERT', async () => {
    fakePool.query.mockResolvedValue({ rows: [] }); // el SELECT de trainers no encuentra nada

    await expect(service.create(newClass)).rejects.toThrow(BadRequestException);
    expect(fakePool.query).toHaveBeenCalledTimes(1); // solo el SELECT, ningún INSERT
  });

  it('remove lanza 409 si la clase tiene reservas y no llega al DELETE', async () => {
    fakePool.query
      .mockResolvedValueOnce({ rows: [spinningRow] }) // 1.ª consulta: findOne encuentra la clase
      .mockResolvedValueOnce({ rows: [{ total: 3 }] }); // 2.ª: el COUNT dice que tiene 3 reservas

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
    expect(fakePool.query).toHaveBeenCalledTimes(2); // nunca hubo una 3.ª (el DELETE)
  });

  it('remove de una clase sin reservas la devuelve y hace el DELETE', async () => {
    fakePool.query
      .mockResolvedValueOnce({ rows: [spinningRow] }) // findOne
      .mockResolvedValueOnce({ rows: [{ total: 0 }] }) // COUNT: sin reservas
      .mockResolvedValueOnce({ rows: [] }); // DELETE

    const gymClass = await service.remove(1);

    expect(gymClass.activity).toBe('Spinning');
    expect(fakePool.query).toHaveBeenCalledTimes(3);
    expect(fakePool.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('DELETE'),
      [1],
    );
  });
});
