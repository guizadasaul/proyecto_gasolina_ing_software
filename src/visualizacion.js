export function obtenerGasolinerasDisponibles(data) {
    return data.filter(g => g.estaActiva);
  }

  export function obtenerStockPorTipo(gasolinera, tipoCombustible) {
    if (!gasolinera.stock || !gasolinera.stock[tipoCombustible]) {
      return 0;
    }
    return gasolinera.stock[tipoCombustible];
  }