import { calcularEstados, calcularNiveles, filtrarPorCombustible } from './visualizacion.js';

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
  it('debería devolver array vacío si no hay gasolineras activas', () => {
    const datos = [
      { nombre: 'G2', estaActiva: false, stock: { magna: 0, premium: 0, diesel: 20 } }
    ];
    expect(calcularNiveles(datos)).toEqual([]);
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
});

describe('SP1.4 – Filtrar gasolineras por tipo de combustible', () => {
  const gasolineras = [
    { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
    { nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 8, diesel: 12 } },
    { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } },
    { nombre: 'G4', estaActiva: false, stock: { magna: 5, premium: 3, diesel: 2 } }
  ];

  it('debería mostrar todas las gasolineras activas cuando el filtro es "todos"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'todos');
    expect(resultado).toEqual([
      { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 8, diesel: 12 } },
      { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } }
    ]);
  });

  it('debería usar "todos" como filtro predeterminado si no se especifica', () => {
    const resultado = filtrarPorCombustible(gasolineras);
    expect(resultado.length).toBe(3); // Solo las gasolineras activas
    expect(resultado).toEqual([
      { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 8, diesel: 12 } },
      { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } }
    ]);
  });

  it('debería filtrar gasolineras activas con magna disponible cuando el filtro es "magna"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'magna');
    expect(resultado.length).toBe(2); // Solo gasolineras activas con magna > 0
    expect(resultado).toEqual([
      { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } }
    ]);
  });

  it('debería filtrar gasolineras activas con diesel disponible cuando el filtro es "diesel"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'diesel');
    expect(resultado.length).toBe(2); // Solo gasolineras activas con diesel > 0
    expect(resultado).toEqual([
      { nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 8, diesel: 12 } },
      { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } }
    ]);
  });
});