import { calcularTiempoEspera } from './tiempoEspera.js';

describe('calcularTiempoEspera', () => {
  test('Debe devolver 5 cuando hay 10 autos y capacidad es 2', () => {
    expect(calcularTiempoEspera(10, 2)).toBe(5);
  });

  
});
