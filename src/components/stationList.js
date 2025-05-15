import { obtenerHorarioDiaActual } from '../utils/timeUtils.js';
import { calcularTiempoEspera } from '../utils/calcUtils.js';

export function renderStationList(estaciones, containerId = 'gasolineras-lista') {
     const container = document.getElementById(containerId);
     container.innerHTML = '';
     estaciones.forEach(est => {
     const card = document.createElement('div');
     card.classList.add('station-card');
     const servicios = Object.entries(est.servicios)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', ') || 'Ninguno';
     const horarioHoy = obtenerHorarioDiaActual(est.horarioSemanal) || 'No disponible';
     const espera = calcularTiempoEspera(est.fila, est.capacidad);
     card.innerHTML = `
          <h2>${est.nombre}</h2>
          <p>${est.direccion}</p>
          <p>Estado: ${est.estaActiva ? 'Disponible' : 'No disponible'}</p>
          <p>Fila: ${est.fila}</p>
          <p>Stock - Magna: ${est.stock.magna}, Premium: ${est.stock.premium}, Diesel: ${est.stock.diesel}</p>
          <p>Tiempo de espera aproximado: ${espera === Infinity ? 'Ilimitado' : espera + ' min'}</p>
          <p>Horario hoy: ${horarioHoy}</p>
          <p>Servicios: ${servicios}</p>
     `;
     container.appendChild(card);
     });
}
