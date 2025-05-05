export function calcularTiempoEspera(longitudFila, capacidadAtencion) {
    if (capacidadAtencion === 0) 
        return Infinity;
    return longitudFila / capacidadAtencion;
  }
  