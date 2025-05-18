import { GasolinerasDemo } from '../data/DatosDemo.js';

export function getEstacionesActivas() {
  return GasolinerasDemo
    .map((est, idx) => ({ value: idx, label: est.nombre, activa: est.estaActiva }))
    .filter(e => e.activa)
    .map(({ value, label }) => ({ value, label }));
}
