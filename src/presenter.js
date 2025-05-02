import { calcularEstados, calcularNiveles } from './visualizacion.js';

const datosDemo = [
  { 
    nombre: 'Gasolinera 1', 
    estaActiva: true, 
    direccion: 'av. santa cruz', 
    coords: [-17.374706203158816, -66.15689669717388],
    stock: { magna: 10, premium: 5, diesel: 0 } 
  },
  { 
    nombre: 'Gasolinera 2', 
    estaActiva: false, 
    direccion: 'av. libertador',
    coords: [-17.375544747649325, -66.16151967753312],
    stock: { magna: 0, premium: 0, diesel: 20 } 
  },
  { 
    nombre: 'Gasolinera 3', 
    estaActiva: true, 
    direccion: 'av. juan de la rosa',
    coords: [-17.379139442834234, -66.16575999447656],
    stock: { magna: 7, premium: 3, diesel: 1 } 
  },
];

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
  });
}
