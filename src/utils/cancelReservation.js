import { guardarGasolineras } from '../components/storage.js';


export function cancelarReserva(ultimaReserva, gasolinerasDatos) {
  if (!ultimaReserva) return false;

  const { estacionIndex, tipo, litros } = ultimaReserva;
  // validaciones
  if (
    typeof estacionIndex !== 'number' ||
    estacionIndex < 0 ||
    estacionIndex >= gasolinerasDatos.length ||
    typeof gasolinerasDatos[estacionIndex].stock[tipo] !== 'number'
  ) {
    return false;
  }

  // 1) restaurar stock
  gasolinerasDatos[estacionIndex].stock[tipo] += litros;
  // 2) persistir
  guardarGasolineras(gasolinerasDatos);
  return true;
}
