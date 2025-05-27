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

export function obtenerQueuePorEstacion(estacionIndex) {
  const queue = cargarQueue();
  return queue[estacionIndex] || [];
}
