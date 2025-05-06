export function calcularEstados(gasolineras) {
  return gasolineras.map(g => ({
    nombre: g.nombre,
    estado: g.estaActiva ? 'Disponible' : 'No disponible',
    direccion: g.direccion,
    capacidad: g.capacidad,
    fila: g.fila,
    horarioSemanal: g.horarioSemanal || undefined // Incluir horario semanal si está disponible
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
  const gasolinerasActivas = gasolineras.filter(g => g.estaActiva);
  
  if (tipo === 'todos') {
    return gasolinerasActivas;
  }

  const tiposValidos = ['magna', 'premium', 'diesel'];
  if (!tiposValidos.includes(tipo)) {
    return gasolinerasActivas;
  }
  
  return gasolinerasActivas.filter(g => {
    return g.stock && g.stock[tipo] > 0;
  });
}

export function calcularTiempoEspera(longitudFila, capacidadAtencion) {
  if (capacidadAtencion === 0) 
      return Infinity;
  return longitudFila / capacidadAtencion;
}
