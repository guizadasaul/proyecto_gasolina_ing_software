/**
 * @jest-environment node
 */

import { cancelarReserva } from '../utils/CancelResevation.js';
import * as storage from '../components/storage.js';

describe('cancelarReserva', () => {
  let gasolinerasDatos;

  beforeEach(() => {
    jest.spyOn(storage, 'guardarGasolineras').mockImplementation(() => {});
    gasolinerasDatos = [
      { stock: { magna: 100, premium: 50, diesel: 20 } }
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe devolver false si no hay reserva', () => {
    expect(cancelarReserva(null, gasolinerasDatos)).toBe(false);
  });
});
