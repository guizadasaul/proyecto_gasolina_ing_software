import { calcularEstados, calcularNiveles } from './visualizacion.js';

describe('SP1.1 – Lógica de estados de gasolineras', () => {
  it('debería mostrar "Disponible" cuando la gasolinera está activa', () => {
    const datos = [{ nombre: 'G1', estaActiva: true }];
    const esperado = [{ nombre: 'G1', estado: 'Disponible' }];
    expect(calcularEstados(datos)).toEqual(esperado);
  });
});

describe('SP1.2 – Ver niveles de combustible', () => {
  it('devuelve nombre y niveles {magna, premium, diesel} sólo para activas', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true,  stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G2', estaActiva: false, stock: { magna:  0, premium: 0, diesel: 20 } },
      { nombre: 'G3', estaActiva: true,  stock: { magna: 7, premium: 3, diesel: 1 } },
    ];
    const esperado = [
      { nombre: 'G1', niveles: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G3', niveles: { magna: 7, premium: 3, diesel: 1 } }
    ];
    expect(calcularNiveles(datos)).toEqual(esperado);
  });
});
