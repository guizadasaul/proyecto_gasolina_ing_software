export function calcularEstados(gasolineras) {
  return gasolineras.map(g => ({
    nombre: g.nombre,
    estado: g.estaActiva ? 'Disponible' : 'No disponible',
    direccion: g.direccion
  }));
}

export function calcularNiveles(gasolineras) {
  return gasolineras
    .filter(g => g.estaActiva)
    .map(g => ({
      nombre: g.nombre,
      niveles: {
        magna: g.stock?.magna ?? 0,
        premium: g.stock?.premium ?? 0,
        diesel: g.stock?.diesel ?? 0
      }
    }));
}

export function filtrarPorCombustible(gasolineras, tipo1, tipo2 = null) {
  if (tipo1 === 'todos') return gasolineras;

  return gasolineras.filter(g => {
    if (!g.estaActiva || !g.stock) return false;
    const tieneTipo1 = g.stock[tipo1] > 0;
    const tieneTipo2 = tipo2 ? g.stock[tipo2] > 0 : true;
    return tieneTipo1 && tieneTipo2;
  });
}


