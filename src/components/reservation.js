import { GasolinerasDemo } from '../data/DatosDemo.js';

export function getEstacionesActivas() {
  return GasolinerasDemo
    .map((est, idx) => ({ value: idx, label: est.nombre, activa: est.estaActiva }))
    .filter(e => e.activa)
    .map(({ value, label }) => ({ value, label }));
}

export function validarSeleccion(estacionValue, tipo, litros) {
  if (estacionValue === null || estacionValue === undefined || estacionValue === '') {
    return { valid: false, mensaje: 'Por favor selecciona una gasolinera.' };
  }
  if (!tipo) {
    return { valid: false, mensaje: 'Por favor selecciona un tipo de combustible.' };
  }
  if (typeof litros !== 'number' || isNaN(litros) || litros < 1 || litros > 50) {
    return { valid: false, mensaje: 'Por favor ingresa un valor entre 1 y 50 litros.' };
  }
  return { valid: true, mensaje: '' };
}

export function verificarDisponibilidad(estacion, tipo, litros, nivelEstacion) {
  if (!nivelEstacion || !nivelEstacion.niveles || typeof nivelEstacion.niveles[tipo] !== 'number') {
    return false;
  }
  return nivelEstacion.niveles[tipo] >= litros;
}

export function procesarSeleccion(estacion, tipo, litros, nivelEstacion) {
  const { valid, mensaje } = validarSeleccion(estacion?.nombre, tipo, litros);
  if (!valid) return { valid, mensaje };

  const hayDisponibilidad = verificarDisponibilidad(estacion, tipo, litros, nivelEstacion);

  if (hayDisponibilidad) {
    if (estacion.stock?.[tipo] !== undefined) {
      estacion.stock[tipo] -= litros;
    }
    const comprobante = generarCodigoComprobante();
    return {
      valid: true,
      mensaje: `¡Reserva exitosa! ${litros} L de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} en ${estacion.nombre} han sido reservados.`,
      reservaConfirmada: true,
      codigo: comprobante
      
    };
  } else {
    return {
      valid: false,
      mensaje: `Lo sentimos, no hay suficiente ${tipo} disponible en ${estacion.nombre} para completar su reserva de ${litros} L.`,
      reservaConfirmada: false
    };
  }
}

export function generarCodigoComprobante() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}