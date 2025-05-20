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
  // nivelEstacion es el objeto de niveles para esta estación específica
  if (!nivelEstacion || !nivelEstacion.niveles || typeof nivelEstacion.niveles[tipo] !== 'number') {
    return false;
  }
  return nivelEstacion.niveles[tipo] >= litros;
}

export function procesarSeleccion(estacion, tipo, litros, nivelEstacion) {
  // Primero validamos los datos de entrada
  const { valid, mensaje } = validarSeleccion(estacion?.nombre, tipo, litros);
  if (!valid) return { valid, mensaje };

  // Verificamos la disponibilidad de combustible
  const hayDisponibilidad = verificarDisponibilidad(estacion, tipo, litros, nivelEstacion);

  if (hayDisponibilidad) {
    return {
      valid: true,
      mensaje: `¡Reserva exitosa! ${litros} L de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} en ${estacion.nombre} han sido reservados.`,
      reservaConfirmada: true
    };
  }
}