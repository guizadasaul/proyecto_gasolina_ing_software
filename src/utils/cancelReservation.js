import { guardarGasolineras } from '../components/storage.js';

export function cancelarReserva(ultimaReserva, gasolinerasDatos) {
  if (!ultimaReserva) return false;

  // Extraemos el nombre de la estación, el tipo y los litros
  const { estacion, tipo, litros } = ultimaReserva;

  // Buscamos el índice en el array a partir del nombre
  const estacionIndex = gasolinerasDatos.findIndex(g => g.nombre === estacion);
  if (estacionIndex < 0) return false;

  // Validamos que exista stock numérico para ese tipo
  if (typeof gasolinerasDatos[estacionIndex].stock[tipo] !== 'number') {
    return false;
  }

  // 1) Restaurar stock
  gasolinerasDatos[estacionIndex].stock[tipo] += litros;
  // 2) Persistir los cambios
  guardarGasolineras(gasolinerasDatos);

  return true;
}
