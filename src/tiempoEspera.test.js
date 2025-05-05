import { calcularTiempoEspera } from './tiempoEspera.js';

describe('calcularTiempoEspera', () => {
  test('Debe devolver 5 cuando hay 10 autos y capacidad es 2', () => {
    expect(calcularTiempoEspera(10, 2)).toBe(5);
  });

  test('Debe devolver 0 si no hay autos en la fila', () => {
    expect(calcularTiempoEspera(0, 5)).toBe(0);
  });

  test('Debe devolver Infinity si la capacidad es 0 (no se atiende a nadie)', () => {
    expect(calcularTiempoEspera(5, 0)).toBe(Infinity);
  });
});
