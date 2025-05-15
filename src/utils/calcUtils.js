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