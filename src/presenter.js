import { calcularEstados, calcularNiveles, filtrarPorCombustible, calcularTiempoEspera } from './visualizacion.js';
import { datosDemo } from './datosDemo.js';


export function renderGasolineras(gasolineras, filtro = 'todos') {
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

  const gasolinerasConCoordenadas = datosDemo.filter(gas => gas.coords);
  
  gasolinerasConCoordenadas.forEach(gas => {
    L.marker(gas.coords)
      .addTo(window.mapaGasolineras)
      .bindPopup(`<strong>${gas.nombre}</strong><br>${gas.direccion}`);
  });

  const estaciones = calcularEstados(gasolineras);
  const niveles = calcularNiveles(gasolineras);

  estaciones.forEach((estacion, index) => {
    const nivelActual = niveles.find(n => n.nombre === estacion.nombre);

    if (filtro !== 'todos' && (!nivelActual || nivelActual.niveles[filtro] <= 0)) {
      return; // Si el filtro está activo y no hay stock, no renderizar esta gasolinera
    }

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

    if (estacion.horarioApertura) {
      const pHorario = document.createElement('p');
      pHorario.className = 'horario-apertura';
      pHorario.innerHTML = `<strong>Horario:</strong> ${estacion.horarioApertura}`;
      div.appendChild(pHorario);
    }

    const ul = document.createElement('ul');

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
        .bindPopup(`<strong>${estacion.nombre}</strong><br>${estacion.direccion}${
          estacion.horarioApertura ? `<br><strong>Horario:</strong> ${estacion.horarioApertura}` : ''
        }`);
      // Evento para centrar mapa al hacer clic en la tarjeta
      div.addEventListener('click', () => {
        window.mapaGasolineras.setView(estacion.coords, 15);
        marker.openPopup();
      });
    }

    div.appendChild(ul);

    const capacidad = estacion.capacidad ?? 1; // valor por defecto si no está definido
    const fila = estacion.fila ?? 0;

    // Calcular tiempo automáticamente
    const resultado = calcularTiempoEspera(fila, capacidad);

    // Mostrar resultado
    const contenedorTiempo = document.createElement('div');
    contenedorTiempo.style.marginTop = '1rem';
    contenedorTiempo.style.borderTop = '1px solid #ccc';
    contenedorTiempo.style.paddingTop = '0.5rem';

    const tituloTiempo = document.createElement('h4');
    tituloTiempo.textContent = 'Tiempo estimado de espera';
    contenedorTiempo.appendChild(tituloTiempo);

    const resultadoTiempo = document.createElement('p');
    resultadoTiempo.textContent = 
    typeof resultado === 'number' 
    ? `Tiempo estimado: ${resultado} minutos` 
    : resultado;

    contenedorTiempo.appendChild(resultadoTiempo);
    div.appendChild(contenedorTiempo);

    contenedor.appendChild(div);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {

    const filtroSelect = document.getElementById('filtro-combustible');
    const aplicarFiltroBtn = document.getElementById('aplicar-filtro');

    aplicarFiltroBtn.addEventListener('click', () => {
      const tipoCombustible = filtroSelect.value;
      renderGasolineras(datosDemo, tipoCombustible);
    });

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
