import { calcularEstados } from './visualizacion.js';

describe('SP1.1 – Lógica de estados de gasolineras', () => {
  it('devuelve [{nombre, estado}] según estaActiva', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true },
      { nombre: 'G2', estaActiva: false }
    ];
    const esperado = [
      { nombre: 'G1', estado: 'Disponible' },
      { nombre: 'G2', estado: 'No disponible' }
    ];
    expect(calcularEstados(datos)).toEqual(esperado);
  });
});
