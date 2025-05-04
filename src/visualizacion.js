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

export function filtrarPorCombustible(gasolineras, tipo = 'todos') {
  // Filtrar solo gasolineras activas
  const gasolinerasActivas = gasolineras.filter(g => g.estaActiva);
  
  // Si el filtro es 'todos', devolver todas las gasolineras activas
  if (tipo === 'todos') {
    return gasolinerasActivas;
  }
  
  // Filtrar por tipo específico de combustible
  if (tipo === 'magna') {
    return gasolinerasActivas.filter(g => g.stock?.magna > 0);
  }
  
  // Para futuros filtros por tipo específico
  return gasolinerasActivas;
}