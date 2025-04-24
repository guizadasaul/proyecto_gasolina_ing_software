export function obtenerGasolinerasDisponibles(data) {
    return data.filter(g => g.estaActiva);
  }