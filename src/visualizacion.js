// ====================
// UTILIDADES DE TIEMPO
// ====================

export function obtenerDiaActual() {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return dias[new Date().getDay()];
}

export function obtenerHorarioDiaActual(horarioSemanal) {
  if (!horarioSemanal) return null;
  const dia = obtenerDiaActual();
  return horarioSemanal[dia] || null;
}

export function estaAbierta(gasolinera) {
  if (!gasolinera.estaActiva) return false;

  const dia = obtenerDiaActual();
  const horario = gasolinera.horarioSemanal?.[dia]?.toLowerCase();

  if (!horario || horario === 'cerrado') return false;
  if (horario.includes('24 horas')) return true;

  const match = horario.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (!match) return false;

  const [, hInicio, mInicio, hFin, mFin] = match.map(Number);
  const ahora = new Date();
  const actualMin = ahora.getHours() * 60 + ahora.getMinutes();
  const inicioMin = hInicio * 60 + mInicio;
  const finMin = hFin * 60 + mFin;

  return actualMin >= inicioMin && actualMin <= finMin;
}

// ====================
// LÓGICA PRINCIPAL
// ====================

export function calcularEstados(gasolineras) {
  return gasolineras.map(g => ({
    nombre: g.nombre,
    estado: g.estaActiva ? 'Disponible' : 'No disponible',
    direccion: g.direccion,
    capacidad: g.capacidad,
    fila: g.fila,
    horarioSemanal: g.horarioSemanal || undefined,
    coords: g.coords,
    servicios: g.servicios
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

export function calcularVehiculosAbastecidos(
  gasolineras,
  consumos = { magna: 40, premium: 50, diesel: 60 }
) {
  return gasolineras.map(g => {
    if (!g.estaActiva || !g.stock) {
      return {
        nombre: g.nombre,
        vehiculos: 0,
        desglose: { magna: 0, premium: 0, diesel: 0 }
      };
    }
    const desglose = {
      magna: Math.floor((g.stock.magna || 0) / consumos.magna),
      premium: Math.floor((g.stock.premium || 0) / consumos.premium),
      diesel: Math.floor((g.stock.diesel || 0) / consumos.diesel)
    };
    return {
      nombre: g.nombre,
      vehiculos: desglose.magna + desglose.premium + desglose.diesel,
      desglose
    };
  });
}

export function calcularTiempoEspera(fila, capacidad) {
  if (capacidad === 0) return Infinity;
  if (fila === 0) return 0;
  return Math.ceil(fila / capacidad);
}

// ====================
// FILTRADO
// ====================

export function filtrarPorCombustible(gasolineras, tipo = 'todos') {
  const activas = gasolineras.filter(g => g.estaActiva);
  if (tipo === 'todos') return activas;
  return activas.filter(g => g.stock?.[tipo] > 0);
}

export function filtrarPorServicio(gasolineras, servicio) {
  return gasolineras.filter(g => g.servicios?.[servicio] === true);
}