import { calcularEstados, calcularNiveles, filtrarPorCombustible } from './visualizacion.js';
import { datosDemo } from './datosDemo.js';



export function renderGasolineras(gasolineras) {
  const contenedor = document.getElementById('gasolineras-lista');
  const mapaContainer = document.getElementById('mapaG1');
  if (!contenedor || !mapaContainer) return;
  contenedor.innerHTML = '';


  if (!window.mapaGasolineras) {
    window.mapaGasolineras = L.map('mapaG1').setView([-17.374706203158816, -66.15689669717388], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(window.mapaGasolineras);
  } else {
    // Limpiar marcadores existentes
    window.mapaGasolineras.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        window.mapaGasolineras.removeLayer(layer);
      }
    });
  }

  const estaciones = calcularEstados(gasolineras);
  const niveles = calcularNiveles(gasolineras);

  estaciones.forEach((estacion, index) => {
    const div = document.createElement('div');
    div.className = 'gasolinera';

    const h3 = document.createElement('h3');
    h3.textContent = estacion.nombre;

    const pEstado = document.createElement('p');
    pEstado.textContent = estacion.estado;

    div.appendChild(h3);
    div.appendChild(pEstado);

    const pDireccion = document.createElement('p');
    pDireccion.textContent = estacion.direccion;
    div.appendChild(pDireccion);

    const ul = document.createElement('ul');
    const nivelActual = niveles.find(n => n.nombre === estacion.nombre);

    if (nivelActual) {
      for (const [tipo, litros] of Object.entries(nivelActual.niveles)) {
        const li = document.createElement('li');
        li.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${litros} L`;

        if (litros === 0) {
          li.style.color = 'red'; 
        }

        ul.appendChild(li);
      }
    }

    if (estacion.coords) {
      const marker = L.marker(estacion.coords)
        .addTo(window.mapaGasolineras)
        .bindPopup(`<strong>${estacion.nombre}</strong><br>${estacion.direccion}`);
      
      // Evento para centrar mapa al hacer clic en la tarjeta
      div.addEventListener('click', () => {
        window.mapaGasolineras.setView(estacion.coords, 15);
        marker.openPopup();
      });
    }

    div.appendChild(ul);
    contenedor.appendChild(div);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderGasolineras(datosDemo);
    const select1 = document.getElementById('filtro-combustible');
  const select2 = document.getElementById('filtro-combustible-2');

  const aplicarFiltro = () => {
    const tipo1 = select1.value;
    const tipo2 = select2.value || null;
    const filtradas = filtrarPorCombustible(datosDemo, tipo1, tipo2);
    renderGasolineras(filtradas);
  };

  select1.addEventListener('change', aplicarFiltro);
  select2.addEventListener('change', aplicarFiltro);
  });
}
