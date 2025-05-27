/**
 * @jest-environment node
 */

import { cancelarReserva } from '../utils/cancelReservation.js';
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

  it('debe devolver false si el índice de estación es inválido', () => {
    const ultimaReserva = { estacionIndex: 1, tipo: 'magna', litros: 10 };
    expect(cancelarReserva(ultimaReserva, gasolinerasDatos)).toBe(false);
  });

  it('debe devolver false si el tipo de combustible no existe', () => {
    const ultimaReserva = { estacionIndex: 0, tipo: 'regular', litros: 5 };
    expect(cancelarReserva(ultimaReserva, gasolinerasDatos)).toBe(false);
  });

  it('debe restaurar stock, llamar a guardarGasolineras y devolver true', () => {
    const ultimaReserva = { estacionIndex: 0, tipo: 'magna', litros: 10 };
    const resultado = cancelarReserva(ultimaReserva, gasolinerasDatos);

    expect(resultado).toBe(true);
    expect(gasolinerasDatos[0].stock.magna).toBe(110);
    expect(storage.guardarGasolineras).toHaveBeenCalledWith(gasolinerasDatos);
  });
});
