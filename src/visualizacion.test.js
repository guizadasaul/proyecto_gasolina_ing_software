import { calcularEstados, 
  calcularNiveles, 
  filtrarPorCombustible, 
  calcularTiempoEspera, 
  obtenerDiaActual, 
  obtenerHorarioDiaActual, 
  filtrarPorServicio,
calcularVehiculosAbastecidos } from './visualizacion.js';
import { datosDemo } from './datosDemo.js';

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
    const datos = [
      { nombre: 'G1', estaActiva: true }
    ];
    const resultado = calcularEstados(datos);
    expect(resultado[0]).toHaveProperty('estado');
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

describe('calcularTiempoEspera', () => {
  it('Debe devolver 5 cuando hay 10 autos y capacidad es 2', () => {
    expect(calcularTiempoEspera(10, 2)).toBe(5);
  });

  it('Debe devolver 0 si no hay autos en la fila', () => {
    expect(calcularTiempoEspera(0, 5)).toBe(0);
  });

  it('Debe devolver Infinity si la capacidad es 0 (no se atiende a nadie)', () => {
    expect(calcularTiempoEspera(5, 0)).toBe(Infinity);
  });
});

describe('SP1.5 – Mostrar horario semanal de atención de gasolineras', () => {
  it('debería incluir el horario semanal cuando está disponible', () => {
    const horarioSemanal = {
      lunes: '08:00 - 20:00',
      martes: '08:00 - 20:00',
      miercoles: '08:00 - 20:00',
      jueves: '08:00 - 20:00',
      viernes: '08:00 - 22:00',
      sabado: '09:00 - 21:00',
      domingo: '10:00 - 18:00'
    };

    const datos = [
      { nombre: 'G1', estaActiva: true, horarioSemanal }
    ];

    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toEqual(horarioSemanal);
  });

  it('debería manejar gasolineras con horario semanal parcial', () => {
    const horarioSemanal = {
      lunes: '08:00 - 20:00',
      viernes: '08:00 - 22:00'
    };

    const datos = [
      { nombre: 'G1', estaActiva: true, horarioSemanal }
    ];

    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toEqual(horarioSemanal);
  });

  it('debería manejar gasolineras sin horario semanal sin lanzar error', () => {
    const datos = [
      { nombre: 'G1', estaActiva: true }
    ];

    const resultado = calcularEstados(datos);
    expect(resultado[0].horarioSemanal).toBeUndefined();
  });
});

describe('obtenerDiaActual', () => {
  it('debería devolver un día de la semana válido', () => {
    const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dia = obtenerDiaActual();
    expect(diasValidos).toContain(dia);
  });
});

describe('obtenerHorarioDiaActual', () => {
  it('debería devolver el horario del día actual cuando existe', () => {
    // Mockear la función obtenerDiaActual para pruebas consistentes
    const diaOriginal = obtenerDiaActual();
    global.Date = class extends Date {
      getDay() {
        return 1; // Lunes (0 es domingo, 1 es lunes, etc.)
      }
    };
    
    const horarioSemanal = {
      lunes: '08:00 - 20:00',
      martes: '09:00 - 21:00'
    };
    
    expect(obtenerHorarioDiaActual(horarioSemanal)).toBe('08:00 - 20:00');
    
    // Restaurar la función original
    global.Date = Date;
  });
  
  it('debería devolver null cuando no hay horario para el día actual', () => {
    // Mockear la función obtenerDiaActual para pruebas consistentes
    global.Date = class extends Date {
      getDay() {
        return 3; // Miércoles
      }
    };
    
    const horarioSemanal = {
      lunes: '08:00 - 20:00',
      jueves: '09:00 - 21:00'
    };
    
    expect(obtenerHorarioDiaActual(horarioSemanal)).toBeNull();
    
    // Restaurar la función original
    global.Date = Date;
  });
  
  it('debería devolver null cuando el horario semanal es null o undefined', () => {
    expect(obtenerHorarioDiaActual(null)).toBeNull();
    expect(obtenerHorarioDiaActual(undefined)).toBeNull();
  });
});

describe('SP1.8 – Filtrar gasolineras por servicio adicional', () => {
  it('debería devolver solo gasolineras con baños disponibles', () => {
    const resultado = filtrarPorServicio(datosDemo, 'banos');
    expect(resultado).toEqual([
      datosDemo[0], // Gasolinera Central
      datosDemo[1], // Estación Sur
      datosDemo[2], // Gas Express
    ]);
  });
  it('debería devolver solo gasolineras con tienda disponibles', () => {
    const resultado = filtrarPorServicio(datosDemo, 'tienda');
    expect(resultado).toEqual([
      datosDemo[3], // Autoservicio Norte
      datosDemo[4], // Gasolinera Express Centro
    ]);
  });
  it('debería devolver solo gasolineras con aire disponibles', () => {
    const resultado = filtrarPorServicio(datosDemo, 'aire');
    expect(resultado).toEqual([
      datosDemo[0], // Gasolinera Central
      datosDemo[2], // Gas Express
      datosDemo[3], // Autoservicio Norte
    ]);
  });
});

describe('SP1.9 – Calcular vehículos que pueden cargar - Pruebas Extendidas', () => {
  // Datos de prueba reutilizables
  const gasolineraActiva = {
    nombre: 'G1',
    estaActiva: true,
    stock: { magna: 200, premium: 150, diesel: 300 }
  };

  const gasolineraInactiva = {
    nombre: 'G2',
    estaActiva: false,
    stock: { magna: 100, premium: 100, diesel: 100 }
  };

  const gasolineraSinStock = {
    nombre: 'G3',
    estaActiva: true,
    stock: { magna: 0, premium: 0, diesel: 0 }
  };

  const gasolineraStockParcial = {
    nombre: 'G4',
    estaActiva: true,
    stock: { magna: 35, premium: 0, diesel: 65 }
  };

  const gasolineraSinDatosStock = {
    nombre: 'G5',
    estaActiva: true
  };

  const consumosPersonalizados = { magna: 25, premium: 20, diesel: 30 };

  // Pruebas con valores por defecto (40, 50, 60)
  describe('Pruebas con consumos por defecto', () => {
    it('debería calcular correctamente para una gasolinera con todos los combustibles', () => {
      const resultado = calcularVehiculosAbastecidos([gasolineraActiva])[0];
      expect(resultado).toEqual({
        nombre: 'G1',
        vehiculos: 13, // 5 (magna) + 3 (premium) + 5 (diesel)
        desglose: {
          magna: 5,    // 200 / 40 = 5
          premium: 3,  // 150 / 50 = 3
          diesel: 5    // 300 / 60 = 5
        }
      });
    });

    it('debería retornar 0 vehículos para gasolinera inactiva', () => {
      const resultado = calcularVehiculosAbastecidos([gasolineraInactiva])[0];
      expect(resultado.vehiculos).toBe(0);
      expect(resultado.desglose.magna).toBe(0);
    });

    it('debería retornar 0 vehículos cuando no hay stock', () => {
      const resultado = calcularVehiculosAbastecidos([gasolineraSinStock])[0];
      expect(resultado.vehiculos).toBe(0);
      expect(resultado.desglose.diesel).toBe(0);
    });


    it('debería manejar gasolineras sin datos de stock', () => {
      const resultado = calcularVehiculosAbastecidos([gasolineraSinDatosStock])[0];
      expect(resultado.vehiculos).toBe(0);
      expect(resultado.desglose).toEqual({
        magna: 0,
        premium: 0,
        diesel: 0
      });
    });

    it('debería redondear hacia abajo los cálculos', () => {
      const gasolinera = {
        nombre: 'G6',
        estaActiva: true,
        stock: { magna: 39, premium: 49, diesel: 59 }
      };
      const resultado = calcularVehiculosAbastecidos([gasolinera])[0];
      expect(resultado.desglose).toEqual({
        magna: 0,    // 39 / 40 = 0.975 → 0
        premium: 0,   // 49 / 50 = 0.98 → 0
        diesel: 0     // 59 / 60 ≈ 0.983 → 0
      });
    });
  });


  // Pruebas de integridad de datos
  describe('Pruebas de integridad de datos', () => {
    it('debería mantener la estructura del objeto de salida incluso con datos incompletos', () => {
      const gasolineraIncompleta = { nombre: 'G9', estaActiva: true };
      const resultado = calcularVehiculosAbastecidos([gasolineraIncompleta])[0];
      
      expect(resultado).toEqual({
        nombre: 'G9',
        vehiculos: 0,
        desglose: {
          magna: 0,
          premium: 0,
          diesel: 0
        }
      });
    });

    it('debería manejar cuando el stock tiene propiedades adicionales', () => {
      const gasolinera = {
        nombre: 'G10',
        estaActiva: true,
        stock: { magna: 100, premium: 50, diesel: 60, electrico: 200 }
      };
      const resultado = calcularVehiculosAbastecidos([gasolinera])[0];
      
      // Debería ignorar el tipo 'electrico' no estándar
      expect(resultado.desglose).toEqual({
        magna: 2,    // 100 / 40 = 2.5 → 2
        premium: 1,  // 50 / 50 = 1
        diesel: 1    // 60 / 60 = 1
      });
    });
  });
});