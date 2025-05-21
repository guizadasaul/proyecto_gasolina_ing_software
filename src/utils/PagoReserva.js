export function procesarPago(reserva, metodo) {
  if (metodo !== 'QR' && metodo !== 'tarjeta') {
    return { exito: false, error: 'Método de pago no válido' };
  }

  return {
    exito: true,
    metodo,
    mensaje: `Pago exitoso con ${metodo}`,
  };
}
