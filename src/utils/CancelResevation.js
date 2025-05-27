import { guardarGasolineras } from '../components/storage.js';

export function cancelarReserva(ultimaReserva, gasolinerasDatos) {
  if (!ultimaReserva) return false;
  const { estacionIndex, tipo, litros } = ultimaReserva;
  const estacion = gasolinerasDatos[estacionIndex];
  if (
    estacionIndex < 0 ||
    estacionIndex >= gasolinerasDatos.length ||
    typeof estacion.stock[tipo] !== 'number'
  ) {
    return false;
  }
  estacion.stock[tipo] += litros;
  guardarGasolineras(gasolinerasDatos);
  return true;
}
