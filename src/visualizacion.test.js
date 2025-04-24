import { obtenerGasolinerasDisponibles, obtenerStockPorTipo } from './visualizacion.js';

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

describe('obtenerStockPorTipo', () => {
    const gasolinera = {
      stock: {
        magna: 200,
        premium: 0,
        diesel: 50
      }
    };
  
    it('devuelve la cantidad correcta de combustible', () => {
      expect(obtenerStockPorTipo(gasolinera, 'magna')).toBe(200);
      expect(obtenerStockPorTipo(gasolinera, 'premium')).toBe(0);
    });
  
    it('devuelve 0 si el tipo de combustible no existe', () => {
      expect(obtenerStockPorTipo(gasolinera, 'hidrogeno')).toBe(0);
    });
  
    it('devuelve 0 si no hay stock definido', () => {
      expect(obtenerStockPorTipo({}, 'magna')).toBe(0);
    });
  });