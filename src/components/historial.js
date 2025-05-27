export let historialReservas = JSON.parse(localStorage.getItem('historialReservas')) || [];

export function mostrarHistorial() {
  const historialSeccion = document.getElementById('historial-seccion');
  const historialLista = document.getElementById('historial-lista');
  const btnLimpiar = document.getElementById('btn-limpiar-historial');

  const visible = historialSeccion.style.display === 'block';
  historialSeccion.style.display = visible ? 'none' : 'block';

  if (visible) {
    if (btnLimpiar) btnLimpiar.style.display = 'none';
    return;
  }

  historialLista.innerHTML = '';

  if (historialReservas.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay reservas registradas.';
    historialLista.appendChild(li);
    if (btnLimpiar) btnLimpiar.style.display = 'none';
    return;
  }

  historialReservas.forEach(reserva => {
    const li = document.createElement('li');
    li.textContent = `${reserva.fecha.split('T')[0]} - ${reserva.litros}L de ${reserva.tipo} en ${reserva.estacion} con código: ${reserva.codigo}`;
    historialLista.appendChild(li);
  });

  if (btnLimpiar) btnLimpiar.style.display = 'inline-block';
}

export function limpiarHistorial() {
  historialReservas = [];
  localStorage.removeItem('historialReservas');
  mostrarHistorial();
}

const btnLimpiar = document.getElementById('btn-limpiar-historial');
if (btnLimpiar) {
  btnLimpiar.addEventListener('click', limpiarHistorial);
}
