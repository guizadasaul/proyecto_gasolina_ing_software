import { procesarPago } from '../utils/PagoReserva';

describe('Pago de reserva', () => {
  const reservaEjemplo = {
    estacion: 'Estación A',
    tipo: 'magna',
    litros: 10,
    total: 80,
  };

  it('debería procesar pago con QR correctamente', () => {
    const resultado = procesarPago(reservaEjemplo, 'QR');
    expect(resultado.exito).toBe(true);
    expect(resultado.metodo).toBe('QR');
  });

});

