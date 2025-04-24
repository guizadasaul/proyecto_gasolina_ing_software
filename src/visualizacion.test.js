import { obtenerGasolinerasDisponibles, } from './visualizacion.js';

describe('obtenerGasolinerasDisponibles', () => {
  it('devuelve solo gasolineras activas', () => {
    const input = [
      { nombre: 'G1', estaActiva: true },
      { nombre: 'G2', estaActiva: false },
    ];
    const resultado = obtenerGasolinerasDisponibles(input);
    expect(resultado).toEqual([{ nombre: 'G1', estaActiva: true }]);
  });
});