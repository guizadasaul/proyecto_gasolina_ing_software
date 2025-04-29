import { calcularEstados, calcularNiveles } from './visualizacion.js';

describe('SP1.1 – Lógica de estados de gasolineras', () => {
  it('debería mostrar "Disponible" cuando la gasolinera está activa', () => {
    const datos = [{ nombre: 'G1', estaActiva: true }];
    const esperado = [{ nombre: 'G1', estado: 'Disponible' }];
    expect(calcularEstados(datos)).toEqual(esperado);
  });
  it('debería mostrar "No disponible" cuando la gasolinera no está activa', () => {
    const datos = [{ nombre: 'G2', estaActiva: false }];
    const esperado = [{ nombre: 'G2', estado: 'No disponible' }];
    expect(calcularEstados(datos)).toEqual(esperado);
  });
  it('debería manejar múltiples gasolineras con diferentes estados', () => {
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

describe('SP1.2 – Ver niveles de combustible', () => {
  it('debería incluir solo gasolineras activas con sus niveles', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G2', estaActiva: false, stock: { magna: 0, premium: 0, diesel: 20 } }
    ];
    const esperado = [
      { nombre: 'G1', niveles: { magna: 10, premium: 5, diesel: 0 } }
    ];
    expect(calcularNiveles(datos)).toEqual(esperado);
  });
});
