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

export function procesarSeleccion(estacionValue, tipo, litros) {
  const { valid, mensaje } = validarSeleccion(estacionValue, tipo, litros);
  if (!valid) return { valid, mensaje };
  const estacion = GasolinerasDemo[estacionValue];
return {
     valid: true,
     mensaje: `Selección exitosa: ${litros} L de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} en ${estacion.nombre}. Proceso de reserva en curso...`,
};
}