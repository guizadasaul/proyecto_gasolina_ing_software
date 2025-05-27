/**
 * @jest-environment jsdom
 */

import { obtenerQueuePorEstacion } from '../utils/QueueService.js';

describe('QueueService', () => {
  const ESTACION_A = 0;

  beforeEach(() => {
    // Limpiamos cualquier dato previo en localStorage
    localStorage.clear();
  });

  it('obtenerQueuePorEstacion debe devolver un array vacío cuando no hay registros', () => {
    expect(obtenerQueuePorEstacion(ESTACION_A)).toEqual([]);
  });
});
