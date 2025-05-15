export function calcularEstados(gasolineras) {
     return gasolineras.map(gasolinera => ({
          nombre: gasolinera.nombre,
          estado: gasolinera.estaActiva ? 'Disponible' : 'No disponible',
          direccion: gasolinera.direccion,
          capacidad: gasolinera.capacidad,
          fila: gasolinera.fila,
          horarioSemanal: gasolinera.horarioSemanal || undefined,
          coords: gasolinera.coords,
          servicios: gasolinera.servicios
     }));
}

export function calcularNiveles(gasolineras) {
     return gasolineras
     .filter(gasolinera => gasolinera.estaActiva)
     .map(gasolinera => ({
          nombre: gasolinera.nombre,
          niveles: {
               magna: gasolinera.stock?.magna ?? 0,
               premium: gasolinera.stock?.premium ?? 0,
               diesel: gasolinera.stock?.diesel ?? 0
          }
     }));
}

export function calcularCapacidadDeAbastecimiento(
     gasolineras,
     consumos = { magna: 40, premium: 50, diesel: 60 }
) {
     return gasolineras.map(gasolinera => {
          if (!gasolinera.estaActiva || !gasolinera.stock) {
               return {
                    nombre: gasolinera.nombre,
                    vehiculos: 0,
                    desglose: { magna: 0, premium: 0, diesel: 0 }
               };
          }
          const desglose = {
               magna: Math.floor((gasolinera.stock.magna || 0) / consumos.magna),
               premium: Math.floor((gasolinera.stock.premium || 0) / consumos.premium),
               diesel: Math.floor((gasolinera.stock.diesel || 0) / consumos.diesel)
          };
          return {
               nombre: gasolinera.nombre,
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