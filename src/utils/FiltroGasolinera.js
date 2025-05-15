export function filtrarPorCombustible(gasolineras, tipo = 'todos') {
     const activas = gasolineras.filter(gasolinera => gasolinera.estaActiva);
     if (tipo === 'todos') return activas;
     return activas.filter(gasolinera => gasolinera.stock?.[tipo] > 0);
}

export function filtrarPorServicio(gasolineras, servicio) {
     return gasolineras.filter(gasolinera => gasolinera.servicios?.[servicio] === true);
}