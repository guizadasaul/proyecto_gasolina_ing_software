import { calcularEstados, calcularNiveles, filtrarPorCombustible, filtrarPorServicio, calcularTiempoEspera, obtenerDiaActual } from './visualizacion.js';
import { datosDemo } from './datosDemo.js';

function estaAbierta(gasolinera) {
  // Obtener el día actual
  const diaActual = obtenerDiaActual();
  
  // Obtener el horario para el día actual
  const horarioDiaActual = gasolinera.horarioSemanal ? gasolinera.horarioSemanal[diaActual] : null;
  
  if (!horarioDiaActual) return false;

  const ahora = new Date();
  const [horaActual, minutoActual] = [ahora.getHours(), ahora.getMinutes()];
  const [horaInicio, minutoInicio, horaFin, minutoFin] = horarioDiaActual
    .replace(/:/g, ' ')
    .split(/[- ]/)
    .map(Number);

  const inicioEnMinutos = horaInicio * 60 + minutoInicio;
  const finEnMinutos = horaFin * 60 + minutoFin;
  const actualEnMinutos = horaActual * 60 + minutoActual;

  return actualEnMinutos >= inicioEnMinutos && actualEnMinutos <= finEnMinutos;
}

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
    // Encontrar la gasolinera original con todos los datos
    const gasolineraCompleta = gasolineras.find(g => g.nombre === estacion.nombre);

    if (filtro !== 'todos' && (!nivelActual || nivelActual.niveles[filtro] <= 0)) {
      return; // Si el filtro está activo y no hay stock, no renderizar esta gasolinera
    }

    const div = document.createElement('div');
    div.className = 'gasolinera';

    const h3 = document.createElement('h3');
    h3.textContent = estacion.nombre;

    const pEstado = document.createElement('p');
    // Usar la función estaAbierta con la gasolinera completa
    pEstado.textContent = estaAbierta(gasolineraCompleta) ? 'Abierta' : 'Cerrada';
    pEstado.style.color = estaAbierta(gasolineraCompleta) ? 'green' : 'red';

    div.appendChild(h3);
    div.appendChild(pEstado);

    const pDireccion = document.createElement('p');
    pDireccion.textContent = estacion.direccion;
    div.appendChild(pDireccion);

    
    // Mostrar horario semanal si está disponible
    if (estacion.horarioSemanal) {
      const divHorario = document.createElement('div');
      divHorario.className = 'horario-semanal';
      
      const hTitulo = document.createElement('h4');
      hTitulo.textContent = 'Horario de atención';
      divHorario.appendChild(hTitulo);
      
      // Obtener el día actual y aplicar un estilo destacado
      const diaActual = obtenerDiaActual();
      
      // Crear una tabla para los horarios
      const tabla = document.createElement('table');
      tabla.className = 'tabla-horarios';
      tabla.style.width = '100%';
      tabla.style.borderCollapse = 'collapse';
      tabla.style.marginTop = '5px';
      tabla.style.fontSize = '0.9em';
      
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      
      const thDia = document.createElement('th');
      thDia.textContent = 'Día';
      thDia.style.textAlign = 'left';
      thDia.style.padding = '3px';
      
      const thHorario = document.createElement('th');
      thHorario.textContent = 'Horario';
      thHorario.style.textAlign = 'left';
      thHorario.style.padding = '3px';
      
      trHead.appendChild(thDia);
      trHead.appendChild(thHorario);
      thead.appendChild(trHead);
      tabla.appendChild(thead);
      
      const tbody = document.createElement('tbody');
      
      const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      
      diasSemana.forEach(dia => {
        const tr = document.createElement('tr');
        
        if (dia === diaActual) {
          tr.style.backgroundColor = '#f0f8ff';
          tr.style.fontWeight = 'bold';
        }
        
        const tdDia = document.createElement('td');
        tdDia.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
        tdDia.style.padding = '3px';
        
        const tdHorario = document.createElement('td');
        tdHorario.textContent = estacion.horarioSemanal && estacion.horarioSemanal[dia] 
          ? estacion.horarioSemanal[dia] 
          : 'Cerrado';
        tdHorario.style.padding = '3px';
        
        tr.appendChild(tdDia);
        tr.appendChild(tdHorario);
        tbody.appendChild(tr);
      });
      
      tabla.appendChild(tbody);
      divHorario.appendChild(tabla);
      div.appendChild(divHorario);
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

    const vehiculosAbastecidos = calcularVehiculosAbastecidos([gasolineraCompleta])[0];
    
    if (vehiculosAbastecidos.vehiculos > 0) {
      const divVehiculos = document.createElement('div');
      divVehiculos.className = 'vehiculos-abastecidos';
      divVehiculos.style.marginTop = '1rem';
      divVehiculos.style.borderTop = '1px solid #ccc';
      divVehiculos.style.paddingTop = '0.5rem';

      const tituloVehiculos = document.createElement('h4');
      tituloVehiculos.textContent = 'Vehículos que pueden cargar';
      divVehiculos.appendChild(tituloVehiculos);

      const infoVehiculos = document.createElement('p');
      infoVehiculos.textContent = `Total estimado: ${vehiculosAbastecidos.vehiculos} vehículos`;
      divVehiculos.appendChild(infoVehiculos);

      const ulVehiculos = document.createElement('ul');
      ulVehiculos.style.marginTop = '0.5rem';

      for (const [tipo, cantidad] of Object.entries(vehiculosAbastecidos.desglose)) {
        if (cantidad > 0) {
          const li = document.createElement('li');
          li.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ~${cantidad} vehículos`;
          ulVehiculos.appendChild(li);
        }
      }

      divVehiculos.appendChild(ulVehiculos);
      div.appendChild(divVehiculos);
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

    // ——— Nuevo bloque: servicios adicionales ———
    const serviciosDiv = document.createElement('div');
    serviciosDiv.className = 'servicios';
    
    if (gasolineraCompleta.servicios?.banos) {
      const ico = document.createElement('span');
      ico.className = 'icono-servicio';
      ico.title = 'Baños disponibles';
      ico.textContent = '🚻';
      serviciosDiv.appendChild(ico);
    }
    if (gasolineraCompleta.servicios?.tienda) {
      const ico = document.createElement('span');
      ico.className = 'icono-servicio';
      ico.title = 'Tienda';
      ico.textContent = '🛒';
      serviciosDiv.appendChild(ico);
    }
    if (gasolineraCompleta.servicios?.aire) {
      const ico = document.createElement('span');
      ico.className = 'icono-servicio';
      ico.title = 'Aire';
      ico.textContent = '⛽️';
      serviciosDiv.appendChild(ico);
    }
    if (serviciosDiv.childElementCount > 0) {
      div.appendChild(serviciosDiv);
    }
    // ——— Fin bloque servicios ———

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
    const chkBanos   = document.getElementById('filtro-banos');
    const chkTienda  = document.getElementById('filtro-tienda');
    const chkAire    = document.getElementById('filtro-aire');
    const btnServicios = document.getElementById('btn-aplicar-filtros');

    function aplicarFiltros() {
      let lista = datosDemo;
      lista = filtrarPorCombustible(lista, filtroSelect.value);
      if (chkBanos.checked)  lista = filtrarPorServicio(lista, 'banos');
      if (chkTienda.checked) lista = filtrarPorServicio(lista, 'tienda');
      if (chkAire.checked)   lista = filtrarPorServicio(lista, 'aire');
      renderGasolineras(lista);
    }

    aplicarFiltroBtn.addEventListener('click', aplicarFiltros);
    btnServicios.addEventListener('click', aplicarFiltros);

    renderGasolineras(datosDemo);
  });
}
