import {
  calcularEstados,
  calcularNiveles,
  calcularVehiculosAbastecidos,
  calcularTiempoEspera,
  estaAbierta,
  obtenerDiaActual,
  obtenerHorarioDiaActual,
  filtrarPorCombustible,
  filtrarPorServicio
} from './visualizacion.js';

import { datosDemo } from './datosDemo.js';

const contenedor = document.getElementById('gasolineras-lista');
const filtroSelect = document.getElementById('filtro-combustible');
const aplicarFiltroBtn = document.getElementById('aplicar-filtro');
const chkBanos = document.getElementById('filtro-banos');
const chkTienda = document.getElementById('filtro-tienda');
const chkAire = document.getElementById('filtro-aire');
const btnServicios = document.getElementById('btn-aplicar-filtros');

function initMapa() {
  if (!window.mapaGasolineras) {
    window.mapaGasolineras = L.map('mapaG1').setView([-17.3747, -66.1568], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.mapaGasolineras);
  }
}

function renderizarTarjetasYMapa(gasolineras) {
  contenedor.innerHTML = '';
  initMapa();

  window.mapaGasolineras.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      window.mapaGasolineras.removeLayer(layer);
    }
  });

  const estados = calcularEstados(gasolineras);
  const niveles = calcularNiveles(gasolineras);
  const abastecidos = calcularVehiculosAbastecidos(gasolineras);

  estados.forEach(estacion => {
    const g = gasolineras.find(x => x.nombre === estacion.nombre);
    const nivel = niveles.find(n => n.nombre === estacion.nombre);
    const abastecimiento = abastecidos.find(v => v.nombre === estacion.nombre);

    const div = document.createElement('div');
    div.className = 'gasolinera';

    const h3 = document.createElement('h3');
    h3.textContent = estacion.nombre;
    div.appendChild(h3);

    const estadoP = document.createElement('p');
    const abierta = g.estaActiva && estaAbierta(g);
    estadoP.className = 'estado ' + (abierta ? 'estado-disponible' : 'estado-no-disponible');
    estadoP.textContent = abierta ? 'Abierta' : 'Cerrada';
    div.appendChild(estadoP);

    const dirP = document.createElement('p');
    dirP.className = 'direccion';
    dirP.textContent = estacion.direccion;
    div.appendChild(dirP);

    const diaActual = obtenerDiaActual();
    const horarioHoy = obtenerHorarioDiaActual(g.horarioSemanal) || 'No disponible';
    const horarioP = document.createElement('p');
    horarioP.innerHTML = `<strong>${diaActual.charAt(0).toUpperCase() + diaActual.slice(1)}:</strong> ${horarioHoy}`;
    div.appendChild(horarioP);

    if (nivel) {
      const ul = document.createElement('ul');
      for (const tipo of ['magna', 'premium', 'diesel']) {
        const li = document.createElement('li');
        const cantidad = nivel.niveles[tipo];
        const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        li.textContent = `${tipoCapitalizado}: ${cantidad} L`;
        li.className = cantidad > 0 ? 'combustible-disponible' : 'combustible-agotado';
        ul.appendChild(li);
      }
      div.appendChild(ul);
    }

    if (abastecimiento?.vehiculos > 0) {
      const seccion = document.createElement('div');
      seccion.innerHTML = `<h4>Capacidad Aproximada de Atencion</h4>
        <p><strong>Aprox:</strong> ${abastecimiento.vehiculos} vehículos</p>`;

      const ulv = document.createElement('ul');
      for (const [tipo, cantidad] of Object.entries(abastecimiento.desglose)) {
        if (cantidad > 0) {
          const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
          const li = document.createElement('li');
          li.textContent = `${tipoCapitalizado} - Aprox: ${cantidad} vehículos`;
          ulv.appendChild(li);
        }
      }
      seccion.appendChild(ulv);
      div.appendChild(seccion);
    }

    if (g.servicios) {
      const serviciosDiv = document.createElement('div');
      serviciosDiv.className = 'servicios';
      if (g.servicios.banos) serviciosDiv.innerHTML += `<span class="icono-servicio" title="Baños">🚻</span>`;
      if (g.servicios.tienda) serviciosDiv.innerHTML += `<span class="icono-servicio" title="Tienda">🛒</span>`;
      if (g.servicios.aire) serviciosDiv.innerHTML += `<span class="icono-servicio" title="Aire">⛽️</span>`;
      div.appendChild(serviciosDiv);
    }

    const espera = calcularTiempoEspera(estacion.fila ?? 0, estacion.capacidad ?? 1);
    const esperaP = document.createElement('p');
    esperaP.innerHTML = `<strong>Tiempo Aproximado de Espera:</strong> ${isFinite(espera) ? espera + ' minutos' : 'N/A'}`;
    div.appendChild(esperaP);

    contenedor.appendChild(div);

    if (estacion.coords) {
      const marker = L.marker(estacion.coords)
        .addTo(window.mapaGasolineras)
        .bindPopup(`<strong>${estacion.nombre}</strong><br>${estacion.direccion}`);
      div.addEventListener('click', () => {
        window.mapaGasolineras.setView(estacion.coords, 15);
        marker.openPopup();
      });
    }
  });
}

function aplicarFiltros() {
  let lista = datosDemo;
  lista = filtrarPorCombustible(lista, filtroSelect.value);
  if (chkBanos.checked) lista = filtrarPorServicio(lista, 'banos');
  if (chkTienda.checked) lista = filtrarPorServicio(lista, 'tienda');
  if (chkAire.checked) lista = filtrarPorServicio(lista, 'aire');
  renderizarTarjetasYMapa(lista);
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarFiltroBtn.addEventListener('click', aplicarFiltros);
  btnServicios.addEventListener('click', aplicarFiltros);
  renderizarTarjetasYMapa(datosDemo);
});
