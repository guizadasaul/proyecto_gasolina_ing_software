const QUEUE_STORAGE_KEY = 'gasolineras_queue';

function cargarQueue() {
  const data = localStorage.getItem(QUEUE_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : {};
  } catch {
    console.warn('Error parseando queue en localStorage. Reiniciando.');
    return {};
  }
}

function guardarQueue(queue) {
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

export function agregarAFila(estacionIndex, placa, nombre) {
  const queue = cargarQueue();
  if (!queue[estacionIndex]) queue[estacionIndex] = [];
  queue[estacionIndex].push({
    placa,
    nombre,
    fecha: new Date().toISOString()
  });
  guardarQueue(queue);
  return queue[estacionIndex];
}

export function obtenerQueuePorEstacion(estacionIndex) {
  const queue = cargarQueue();
  return queue[estacionIndex] || [];
}
