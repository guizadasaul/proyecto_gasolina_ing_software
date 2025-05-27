export function obtenerHistorial() {
  return JSON.parse(localStorage.getItem('historial_reservas')) || [];
}

export function agregarReservaAlHistorial(reserva) {
  const historial = obtenerHistorial();
  historial.push(reserva);
  localStorage.setItem('historial_reservas', JSON.stringify(historial));
}

export function mostrarHistorial() {
  const lista = document.getElementById('historial-lista');
  lista.innerHTML = '';

  const historial = obtenerHistorial();

  if (historial.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay reservas registradas.';
    lista.appendChild(li);
    return;
  }

  historial.forEach(reserva => {
    const li = document.createElement('li');
    li.textContent = `${reserva.fecha}: ${reserva.litros}L de ${reserva.tipo} en ${reserva.estacion}`;
    lista.appendChild(li);
  });
}
