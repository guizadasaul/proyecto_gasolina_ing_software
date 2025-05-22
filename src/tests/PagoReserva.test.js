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

  
  it('debería procesar pago con tarjeta correctamente', () => {
    const resultado = procesarPago(reservaEjemplo, 'tarjeta');
    expect(resultado.exito).toBe(true);
    expect(resultado.metodo).toBe('tarjeta');
  });

  it('debería rechazar métodos de pago no válidos', () => {
    const resultado = procesarPago(reservaEjemplo, 'efectivo');
    expect(resultado.exito).toBe(false);
    expect(resultado.error).toBe('Método de pago no válido');
  });

});
