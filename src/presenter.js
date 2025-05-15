import {
  calcularEstados,
  calcularNiveles,
  calcularCapacidadDeAbastecimiento,
  calcularTiempoEspera
} from './utils/CalculoGasolinera.js';
import {
  gasolineraEstaAbierta,
  obtenerNombreDiaActual,
  obtenerHorarioDiaActual
} from './utils/HorarioGasolinera.js';
import {
  filtrarPorCombustible,
  filtrarPorServicio
} from './utils/FiltroGasolinera.js';
import { GasolinerasDemo as gasolinerasDatos } from './data/DatosDemo.js';
import { initMap, clearMarkers } from './components/map.js';

const listaGasolineras = document.getElementById('gasolineras-lista');
const selectCombustible = document.getElementById('filtro-combustible');
const botonFiltrarCombustible = document.getElementById('aplicar-filtro');
const chkFiltroBanos = document.getElementById('filtro-banos');
const chkFiltroTienda = document.getElementById('filtro-tienda');
const chkFiltroAire = document.getElementById('filtro-aire');
const botonFiltrarServicios = document.getElementById('btn-aplicar-filtros');

function renderizarGasolineras(gasolineras) {
  listaGasolineras.innerHTML = '';
  initMap();
  clearMarkers();

  const estados = calcularEstados(gasolineras);
  const nivelesCombustible = calcularNiveles(gasolineras);
  const datosAbastecimiento = calcularCapacidadDeAbastecimiento(gasolineras);

  estados.forEach(estadoGasolinera => {
    const gasolinera = gasolineras.find(g => g.nombre === estadoGasolinera.nombre);
    const nivel = nivelesCombustible.find(n => n.nombre === estadoGasolinera.nombre);
    const abastecimiento = datosAbastecimiento.find(a => a.nombre === estadoGasolinera.nombre);

    const tarjeta = document.createElement('div');
    tarjeta.className = 'gasolinera';

    const titulo = document.createElement('h3');
    titulo.textContent = estadoGasolinera.nombre;
    tarjeta.appendChild(titulo);

    const parrafoEstado = document.createElement('p');
    const estaDisponible = gasolinera.estaActiva && gasolineraEstaAbierta(gasolinera);
    parrafoEstado.className = 'estado ' + (estaDisponible ? 'estado-disponible' : 'estado-no-disponible');
    parrafoEstado.textContent = estaDisponible ? 'Abierta' : 'Cerrada';
    tarjeta.appendChild(parrafoEstado);

    const parrafoDireccion = document.createElement('p');
    parrafoDireccion.className = 'direccion';
    parrafoDireccion.textContent = estadoGasolinera.direccion;
    tarjeta.appendChild(parrafoDireccion);

    const diaHoy = obtenerNombreDiaActual();
    const horarioHoy = obtenerHorarioDiaActual(gasolinera.horarioSemanal) || 'No disponible';
    const parrafoHorario = document.createElement('p');
    parrafoHorario.innerHTML = `<strong>${diaHoy.charAt(0).toUpperCase() + diaHoy.slice(1)}:</strong> ${horarioHoy}`;
    tarjeta.appendChild(parrafoHorario);

    if (nivel) {
      const listaCombustibles = document.createElement('ul');
      for (const tipoCombustible of ['magna', 'premium', 'diesel']) {
        const item = document.createElement('li');
        const cantidad = nivel.niveles[tipoCombustible];
        const nombreTipo = tipoCombustible.charAt(0).toUpperCase() + tipoCombustible.slice(1);
        item.textContent = `${nombreTipo}: ${cantidad} L`;
        item.className = cantidad > 0 ? 'combustible-disponible' : 'combustible-agotado';
        listaCombustibles.appendChild(item);
      }
      tarjeta.appendChild(listaCombustibles);
    }

    if (abastecimiento?.vehiculos > 0) {
      const seccionAbastecimiento = document.createElement('div');
      seccionAbastecimiento.innerHTML = `<h4>Capacidad Aproximada de Atencion</h4>
        <p><strong>Aprox:</strong> ${abastecimiento.vehiculos} vehículos</p>`;

      const listaVehiculos = document.createElement('ul');
      for (const [tipo, cantidad] of Object.entries(abastecimiento.desglose)) {
        if (cantidad > 0) {
          const nombreTipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
          const item = document.createElement('li');
          item.textContent = `${nombreTipo} - Aprox: ${cantidad} vehículos`;
          listaVehiculos.appendChild(item);
        }
      }
      seccionAbastecimiento.appendChild(listaVehiculos);
      tarjeta.appendChild(seccionAbastecimiento);
    }

    if (gasolinera.servicios) {
      const contenedorServicios = document.createElement('div');
      contenedorServicios.className = 'servicios';
      if (gasolinera.servicios.banos) contenedorServicios.innerHTML += `<span class="icono-servicio" title="Baños">🚻</span>`;
      if (gasolinera.servicios.tienda) contenedorServicios.innerHTML += `<span class="icono-servicio" title="Tienda">🛒</span>`;
      if (gasolinera.servicios.aire) contenedorServicios.innerHTML += `<span class="icono-servicio" title="Aire">⛽️</span>`;
      tarjeta.appendChild(contenedorServicios);
    }

    const tiempoEspera = calcularTiempoEspera(estadoGasolinera.fila ?? 0, estadoGasolinera.capacidad ?? 1);
    const parrafoEspera = document.createElement('p');
    parrafoEspera.innerHTML = `<strong>Tiempo Aproximado de Espera:</strong> ${isFinite(tiempoEspera) ? tiempoEspera + ' minutos' : 'N/A'}`;
    tarjeta.appendChild(parrafoEspera);

    listaGasolineras.appendChild(tarjeta);

    if (estadoGasolinera.coords) {
      const marcador = L.marker(estadoGasolinera.coords)
        .addTo(window.mapaGasolineras)
        .bindPopup(`<strong>${estadoGasolinera.nombre}</strong><br>${estadoGasolinera.direccion}`);
      tarjeta.addEventListener('click', () => {
        window.mapaGasolineras.setView(estadoGasolinera.coords, 15);
        marcador.openPopup();
      });
    }
  });
}

function aplicarFiltros() {
  let gasolinerasFiltradas = gasolinerasDatos;
  gasolinerasFiltradas = filtrarPorCombustible(gasolinerasFiltradas, selectCombustible.value);
  if (chkFiltroBanos.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'banos');
  if (chkFiltroTienda.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'tienda');
  if (chkFiltroAire.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'aire');
  renderizarGasolineras(gasolinerasFiltradas);
}

document.addEventListener('DOMContentLoaded', () => {
  botonFiltrarCombustible.addEventListener('click', aplicarFiltros);
  botonFiltrarServicios.addEventListener('click', aplicarFiltros);
  renderizarGasolineras(gasolinerasDatos);
});
