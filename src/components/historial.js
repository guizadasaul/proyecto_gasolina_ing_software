export let historialReservas = JSON.parse(localStorage.getItem('historialReservas')) || [];

export function mostrarHistorial() {
  const historialSeccion = document.getElementById('historial-seccion');
  const historialLista = document.getElementById('historial-lista');

  historialSeccion.style.display = historialSeccion.style.display === 'none' ? 'block' : 'none';

  historialLista.innerHTML = '';

  if (historialReservas.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay reservas registradas.';
    historialLista.appendChild(li);
    return;
  }

  historialReservas.forEach(reserva => {
    const li = document.createElement('li');
    li.textContent = `${reserva.fecha.split('T')[0]} - ${reserva.litros}L de ${reserva.tipo} en ${reserva.estacion} con codigo: ${reserva.codigo}`;
    historialLista.appendChild(li);
  });
}
