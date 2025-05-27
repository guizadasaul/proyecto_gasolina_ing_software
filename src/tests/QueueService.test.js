/**
 * @jest-environment jsdom
 */

import { agregarAFila, obtenerQueuePorEstacion } from '../utils/QueueService.js';

describe('QueueService', () => {
  const ESTACION_A = 0;
  const ESTACION_B = 1;

  beforeEach(() => {
    // Limpiamos cualquier dato previo en localStorage
    localStorage.clear();
  });

  it('obtenerQueuePorEstacion debe devolver un array vacío cuando no hay registros', () => {
    expect(obtenerQueuePorEstacion(ESTACION_A)).toEqual([]);
  });

  it('agregarAFila debe añadir un registro y devolver la lista actualizada', () => {
    const registros = agregarAFila(ESTACION_A, 'ABC-123', 'Juan Pérez');
    expect(registros).toHaveLength(1);

    const entry = registros[0];
    expect(entry).toMatchObject({
      placa: 'ABC-123',
      nombre: 'Juan Pérez'
    });
    // La fecha debe ser una cadena ISO válida
    expect(typeof entry.fecha).toBe('string');
    expect(!isNaN(Date.parse(entry.fecha))).toBe(true);

    // Además, obtenerQueuePorEstacion debe devolver lo mismo
    expect(obtenerQueuePorEstacion(ESTACION_A)).toEqual(registros);
  });

  it('agregarAFila debe acumular múltiples registros para la misma estación', () => {
    agregarAFila(ESTACION_A, 'AAA-001', 'Ana');
    const registros2 = agregarAFila(ESTACION_A, 'BBB-002', 'Luis');

    expect(registros2).toHaveLength(2);
    expect(registros2.map(r => r.placa)).toEqual(['AAA-001', 'BBB-002']);
  });

  it('mantiene colas separadas para distintas estaciones', () => {
    agregarAFila(ESTACION_A, '111-AAA', 'Pedro');
    agregarAFila(ESTACION_B, '222-BBB', 'María');

    const colaA = obtenerQueuePorEstacion(ESTACION_A);
    const colaB = obtenerQueuePorEstacion(ESTACION_B);

    expect(colaA).toHaveLength(1);
    expect(colaA[0].placa).toBe('111-AAA');

    expect(colaB).toHaveLength(1);
    expect(colaB[0].placa).toBe('222-BBB');
  });
});
