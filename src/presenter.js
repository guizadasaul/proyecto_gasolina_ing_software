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
import {
  cargarGasolineras,
  guardarGasolineras,
  resetearGasolineras
} from './components/storage.js';

let gasolinerasDatos = cargarGasolineras();
let ultimaReserva = null;

import { initMap, clearMarkers } from './components/map.js';
import {
  getEstacionesActivas,
  validarSeleccion,
  procesarSeleccion,
} from './components/reservation.js';
import { procesarPago } from './utils/PagoReserva.js';
import { cargarComprobanteActual, guardarComprobanteActual } from './components/storage.js';



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

    const resumen = document.createElement('div');
    resumen.className = 'gasolinera-resumen';

    const titulo = document.createElement('h3');
    titulo.textContent = estadoGasolinera.nombre;
    resumen.appendChild(titulo);

    const parrafoEstado = document.createElement('p');
    const estaDisponible = gasolinera.estaActiva && gasolineraEstaAbierta(gasolinera);
    parrafoEstado.className = 'estado ' + (estaDisponible ? 'estado-disponible' : 'estado-no-disponible');
    parrafoEstado.textContent = estaDisponible ? 'Abierta' : 'Cerrada';
    resumen.appendChild(parrafoEstado);

    const parrafoDireccion = document.createElement('p');
    parrafoDireccion.className = 'direccion';
    parrafoDireccion.textContent = gasolinera.direccion;
    resumen.appendChild(parrafoDireccion);

    const diaHoy = obtenerNombreDiaActual();
    const horarioHoy = obtenerHorarioDiaActual(gasolinera.horarioSemanal) || 'No disponible';
    const parrafoHorario = document.createElement('p');
    parrafoHorario.innerHTML = `<strong>${diaHoy.charAt(0).toUpperCase() + diaHoy.slice(1)}:</strong> ${horarioHoy}`;
    resumen.appendChild(parrafoHorario);

    resumen.style.cursor = 'pointer';
    tarjeta.appendChild(resumen);

    const detalles = document.createElement('div');
    detalles.className = 'gasolinera-detalles';
    detalles.style.display = 'none';

    if (nivel) {
      const listaCombustibles = document.createElement('ul');
      for (const tipo of ['magna', 'premium', 'diesel']) {
        const item = document.createElement('li');
        const cantidad = nivel.niveles[tipo];
        item.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${cantidad} L`;
        item.className = cantidad > 0 ? 'combustible-disponible' : 'combustible-agotado';
        listaCombustibles.appendChild(item);
      }
      detalles.appendChild(listaCombustibles);
    }

    if (abastecimiento?.vehiculos > 0) {
      const seccionAbastecimiento = document.createElement('div');
      seccionAbastecimiento.innerHTML = `<h4>Capacidad Aproximada de Atención</h4>
        <p><strong>Aprox:</strong> ${abastecimiento.vehiculos} vehículos</p>`;
      const listaVehiculos = document.createElement('ul');
      for (const [tipo, cantidad] of Object.entries(abastecimiento.desglose)) {
        if (cantidad > 0) {
          const item = document.createElement('li');
          item.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - Aprox: ${cantidad} vehículos`;
          listaVehiculos.appendChild(item);
        }
      }
      seccionAbastecimiento.appendChild(listaVehiculos);
      detalles.appendChild(seccionAbastecimiento);
    }

    if (gasolinera.servicios) {
      const contenedorServicios = document.createElement('div');
      contenedorServicios.className = 'servicios';
      if (gasolinera.servicios.banos) contenedorServicios.innerHTML += '🚻';
      if (gasolinera.servicios.tienda) contenedorServicios.innerHTML += '🛒';
      if (gasolinera.servicios.aire) contenedorServicios.innerHTML += '⛽️';
      detalles.appendChild(contenedorServicios);
    }

    const tiempoEspera = calcularTiempoEspera(estadoGasolinera.fila ?? 0, estadoGasolinera.capacidad ?? 1);
    const parrafoEspera = document.createElement('p');
    parrafoEspera.innerHTML = `<strong>Tiempo Espera:</strong> ${isFinite(tiempoEspera) ? tiempoEspera + ' min' : 'N/A'}`;
    detalles.appendChild(parrafoEspera);

    tarjeta.appendChild(detalles);

    resumen.addEventListener('click', () => {
      detalles.style.display = detalles.style.display === 'none' ? 'block' : 'none';
    });

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

function actualizarComprobanteEnPantalla() {
  const contenedor = document.getElementById('comprobante-mensaje');
  if (!ultimaReserva || !ultimaReserva.codigo) {
    contenedor.textContent = 'No se ha realizado ninguna reserva aún.';
  } else {
    contenedor.innerHTML = `
      <strong>Gasolinera:</strong> ${ultimaReserva.estacion}<br>
      <strong>Tipo:</strong> ${ultimaReserva.tipo}<br>
      <strong>Litros:</strong> ${ultimaReserva.litros}<br>
      <strong>Fecha:</strong> ${new Date(ultimaReserva.fecha).toLocaleString()}<br>
      <strong>Código de comprobante:</strong> <code>${ultimaReserva.codigo}</code>
    `;
  }
}


function aplicarFiltros() {
  let gasolinerasFiltradas = gasolinerasDatos;
  gasolinerasFiltradas = filtrarPorCombustible(gasolinerasFiltradas, selectCombustible.value);
  if (chkFiltroBanos.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'banos');
  if (chkFiltroTienda.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'tienda');
  if (chkFiltroAire.checked) gasolinerasFiltradas = filtrarPorServicio(gasolinerasFiltradas, 'aire');
  renderizarGasolineras(gasolinerasFiltradas);
}

function initReservation(selectId, tipoId, formId, messageId, onSuccess) {
  const selectEstacion = document.getElementById(selectId);
  const selectTipo = document.getElementById(tipoId);
  const form = document.getElementById(formId);
  const mensaje = document.getElementById(messageId);
  const inputLitros = document.getElementById('reserva-litros');

  selectEstacion.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = 'Selecciona una estación';
  selectEstacion.appendChild(defaultOption);

  getEstacionesActivas().forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    selectEstacion.appendChild(option);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const estacionIndex = selectEstacion.value;
    const tipo = selectTipo.value;
    const litros = parseFloat(inputLitros.value);

    if (estacionIndex === '') {
      mensaje.textContent = 'Por favor selecciona una gasolinera.';
      mensaje.className = 'error';
      return;
    }

    const estacion = gasolinerasDatos[estacionIndex];
    const nivelesCombustible = calcularNiveles(gasolinerasDatos);
    const nivelEstacion = nivelesCombustible.find(n => n.nombre === estacion.nombre);

    const validation = validarSeleccion(estacion?.nombre, tipo, litros);
    if (!validation.valid) {
      mensaje.textContent = validation.mensaje;
      mensaje.className = 'error';
      return;
    }

    const resultado = procesarSeleccion(estacion, tipo, litros, nivelEstacion);
    mensaje.textContent = resultado.mensaje;
    mensaje.className = resultado.valid ? 'success' : 'error';
    if (resultado.valid) {
      guardarGasolineras(gasolinerasDatos);
      const comprobanteTexto = resultado.codigo
        ? `\nCódigo de comprobante: ${resultado.codigo}`
        : '';
      mensaje.textContent = resultado.mensaje + comprobanteTexto;
      mensaje.className = 'success';
      ultimaReserva = {
        estacion: estacion.nombre,
        tipo,
        litros,
        mensaje: resultado.mensaje,
        fecha: new Date().toISOString(),
        codigo: resultado.codigo || null
      };
      guardarComprobanteActual(ultimaReserva);
      actualizarComprobanteEnPantalla();
      onSuccess();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  botonFiltrarCombustible.addEventListener('click', aplicarFiltros);
  botonFiltrarServicios.addEventListener('click', aplicarFiltros);
  renderizarGasolineras(gasolinerasDatos);
  ultimaReserva = cargarComprobanteActual();
  actualizarComprobanteEnPantalla();
  initReservation('reserva-estacion', 'reserva-tipo', 'form-reserva', 'reserva-mensaje', () => {
  renderizarGasolineras(gasolinerasDatos);

  });

  const selectMetodo = document.getElementById('pago-metodo');
  const tarjetaDatos = document.getElementById('tarjeta-datos');
  const qrImagen = document.getElementById('qr-imagen');

  selectMetodo.addEventListener('change', () => {
    const metodo = selectMetodo.value;
    if (metodo === 'tarjeta') {
      tarjetaDatos.style.display = 'block';
    } else {
      tarjetaDatos.style.display = 'none';
    }

    if (metodo === 'QR' && ultimaReserva) {
      const textoQR = `Pago para ${ultimaReserva.litros}L de ${ultimaReserva.tipo} en ${ultimaReserva.estacion}`;
      qrImagen.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(textoQR)}`;
      qrImagen.style.display = 'block';
    } else {
      qrImagen.style.display = 'none';
    }

  });
});

document.getElementById('form-pago').addEventListener('submit', event => {
  event.preventDefault();

  const metodo = document.getElementById('pago-metodo').value;
  const mensajePago = document.getElementById('pago-mensaje');

  if (!ultimaReserva) {
    mensajePago.textContent = 'Primero debe realizar una reserva antes de pagar.';
    mensajePago.className = 'error';
    return;
  }

  if (!metodo) {
    mensajePago.textContent = 'Por favor selecciona un método de pago.';
    mensajePago.className = 'error';
    return;
  }

  const resultadoPago = procesarPago(ultimaReserva, metodo);

  if (!resultadoPago.exito) {
    mensajePago.textContent = resultadoPago.error;
    mensajePago.className = 'error';
    return;
  }

 mensajePago.textContent = `${resultadoPago.mensaje} para la reserva de ${ultimaReserva.litros}L de ${ultimaReserva.tipo} en ${ultimaReserva.estacion}. Código: ${ultimaReserva.codigo || 'N/A'}`;
 mensajePago.className = 'success';
 actualizarComprobanteEnPantalla();

});

document.getElementById('btn-resetear').addEventListener('click', () => {
  resetearGasolineras();
  location.reload();
});