export function filtrarPorCombustible(gasolineras, tipo = 'todos') {
     const activas = gasolineras.filter(g => g.estaActiva);
     if (tipo === 'todos') return activas;
     return activas.filter(g => g.stock?.[tipo] > 0);
}

export function filtrarPorServicio(gasolineras, servicio) {
     return gasolineras.filter(g => g.servicios?.[servicio] === true);
}