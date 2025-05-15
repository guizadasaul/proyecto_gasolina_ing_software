import {
  calcularEstados,
  calcularNiveles,
  calcularCapacidadDeAbastecimiento,
  calcularTiempoEspera
} from '../utils/CalculoGasolinera.js';

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
    const datos = [{ nombre: 'G1', estaActiva: true }];
    const resultado = calcularEstados(datos);
    expect(resultado[0]).toHaveProperty('estado');
  });
});

describe('SP1.5 – Mostrar horario semanal', () => {
  it('debería incluir el horario semanal cuando está disponible', () => {
    const horarioSemanal = {
      lunes: '08:00 - 20:00',
      martes: '08:00 - 20:00'
    };
    const datos = [{ nombre: 'G1', estaActiva: true, horarioSemanal }];
    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toEqual(horarioSemanal);
  });

  it('debería manejar horario semanal parcial', () => {
    const horarioSemanal = { viernes: '08:00 - 22:00' };
    const datos = [{ nombre: 'G1', estaActiva: true, horarioSemanal }];
    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toEqual(horarioSemanal);
  });

  it('debería manejar sin horario semanal sin lanzar error', () => {
    const datos = [{ nombre: 'G1', estaActiva: true }];
    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toBeUndefined();
  });
});

describe('SP1.6 – Calcular tiempo de espera', () => {
  it('Debe devolver 5 cuando hay 10 autos y capacidad es 2', () => {
    expect(calcularTiempoEspera(10, 2)).toBe(5);
  });

  it('Debe devolver 0 si no hay autos en la fila', () => {
    expect(calcularTiempoEspera(0, 5)).toBe(0);
  });

  it('Debe devolver Infinity si capacidad es 0', () => {
    expect(calcularTiempoEspera(5, 0)).toBe(Infinity);
  });
});

describe('SP1.9 – Calcular vehículos que pueden cargar', () => {
  const defaultGasolinera = {
    nombre: 'G1',
    estaActiva: true,
    stock: { magna: 200, premium: 150, diesel: 300 }
  };

  it('debería calcular correctamente usando divisiones por tipo de combustible', () => {
    const [r] = calcularCapacidadDeAbastecimiento([defaultGasolinera]);
    expect(r).toEqual({
      nombre: 'G1',
      vehiculos: 13,
      desglose: {
        magna: 5,
        premium: 3,
        diesel: 5
      }
    });
  });

  it('debería retornar 0 vehículos si la gasolinera está inactiva', () => {
    const [r] = calcularCapacidadDeAbastecimiento([{ ...defaultGasolinera, estaActiva: false }]);
    expect(r.vehiculos).toBe(0);
  });

  it('debería retornar 0 vehículos si no hay stock', () => {
    const [r] = calcularCapacidadDeAbastecimiento([{ nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 0, diesel: 0 } }]);
    expect(r.vehiculos).toBe(0);
  });

  it('debería retornar 0 si no tiene stock definido', () => {
    const [r] = calcularCapacidadDeAbastecimiento([{ nombre: 'G3', estaActiva: true }]);
    expect(r.vehiculos).toBe(0);
    expect(r.desglose).toEqual({ magna: 0, premium: 0, diesel: 0 });
  });

  it('debería redondear hacia abajo correctamente', () => {
    const stock = { magna: 39, premium: 49, diesel: 59 };
    const [r] = calcularCapacidadDeAbastecimiento([{ nombre: 'G4', estaActiva: true, stock }]);
    expect(r.desglose).toEqual({ magna: 0, premium: 0, diesel: 0 });
  });

  it('debería ignorar combustibles no estándar', () => {
    const stock = { magna: 80, premium: 50, diesel: 60, electrico: 1000 };
    const [r] = calcularCapacidadDeAbastecimiento([{ nombre: 'G5', estaActiva: true, stock }]);
    expect(r.desglose).toEqual({ magna: 2, premium: 1, diesel: 1 });
    expect(r.vehiculos).toBe(4);
  });

  it('debería mantener la estructura incluso con datos incompletos', () => {
    const [r] = calcularCapacidadDeAbastecimiento([{ nombre: 'G6', estaActiva: true }]);
    expect(r).toHaveProperty('desglose');
    expect(r.desglose).toEqual({ magna: 0, premium: 0, diesel: 0 });
  });
});