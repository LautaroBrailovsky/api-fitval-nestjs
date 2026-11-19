import { toPlan } from './plan';

describe('toPlan', () => {
  it('convierte el precio de texto (NUMERIC) a número', () => {
    // NUMERIC llega de PostgreSQL como texto
    const plan = toPlan({ id: 1, name: 'Básico', monthly_price: '29.90' });

    expect(plan.monthlyPrice).toBe(30); // el número, no el texto '29.90'
    expect(plan).toEqual({ id: 1, name: 'Básico', monthlyPrice: 29.9 });
  });
});
