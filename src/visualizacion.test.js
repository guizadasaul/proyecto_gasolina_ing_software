import { calcularEstados, calcularNiveles } from './visualizacion.js';

describe('SP1.1 – Lógica de estados de gasolineras', () => {
  it('debería mostrar "Disponible" cuando la gasolinera está activa', () => {
    const datos = [{ nombre: 'G1', estaActiva: true }];
    const esperado = [{ nombre: 'G1', estado: 'Disponible' }];
    expect(calcularEstados(datos)).toEqual(expect.arrayContaining(esperado));
  });
  it('debería mostrar "No disponible" cuando la gasolinera no está activa', () => {
    const datos = [{ nombre: 'G2', estaActiva: false }];
    const esperado = [{ nombre: 'G2', estado: 'No disponible' }];
    expect(calcularEstados(datos)).toEqual(expect.arrayContaining(esperado));
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
    expect(calcularEstados(datos)).toEqual(expect.arrayContaining(esperado));
  });
  it('debería manejar gasolineras sin campo estaActiva como "No disponible"', () => {
    const datos = [{ nombre: 'G3' }];
    const esperado = [{ nombre: 'G3', estado: 'No disponible' }];
    expect(calcularEstados(datos)).toEqual(expect.arrayContaining(esperado));
  });
  it('debería mantener campos adicionales como la dirección', () => {
    const datos = [{ nombre: 'G4', estaActiva: true, direccion: 'Av. Prado' }];
    const resultado = calcularEstados(datos);
    expect(resultado[0]).toMatchObject({
      nombre: 'G4',
      estado: 'Disponible',
      direccion: 'Av. Prado'
    });
  });
  it('debería manejar múltiples gasolineras con diferentes estados', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true },
      { nombre: 'G2', estaActiva: false }
    ];
    const resultado = calcularEstados(datos);
    expect(resultado).toHaveLength(2);
    expect(resultado).toEqual(expect.arrayContaining([
      expect.objectContaining({ nombre: 'G1', estado: 'Disponible' }),
      expect.objectContaining({ nombre: 'G2', estado: 'No disponible' })
    ]));
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
  it('debería manejar correctamente los niveles de múltiples gasolineras activas', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 3, diesel: 1 } }
    ];
    const esperado = [
      { nombre: 'G1', niveles: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G3', niveles: { magna: 7, premium: 3, diesel: 1 } }
    ];
    expect(calcularNiveles(datos)).toEqual(esperado);
  });
  
  it('debería manejar niveles incompletos con valores faltantes como 0', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true, stock: { magna: 5 } }
    ];
    const resultado = calcularNiveles(datos);
    expect(resultado[0].niveles).toMatchObject({
      magna: 5
    });
  });
});

describe('SP1.3 – Mostrar dirección de gasolineras', () => {
  it('debería incluir la dirección de cada gasolinera', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true, direccion: 'Calle Falsa 123' },
      { nombre: 'G2', estaActiva: false, direccion: 'Av. Siempre Viva 742' }
    ];
    const esperado = [
      { nombre: 'G1', estado: 'Disponible', direccion: 'Calle Falsa 123' },
      { nombre: 'G2', estado: 'No disponible', direccion: 'Av. Siempre Viva 742' }
    ];
    expect(calcularEstados(datos)).toEqual(esperado);
  });
  it('debería manejar gasolineras sin dirección sin lanzar error', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true }
    ];
    const resultado = calcularEstados(datos);
    expect(resultado[0]).toHaveProperty('estado');
  });
});
