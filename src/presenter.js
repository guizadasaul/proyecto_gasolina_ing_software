import { calcularEstados } from './visualizacion.js';

export function renderGasolineras(gasolineras) {
  const contenedor = document.getElementById('gasolineras-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  const estaciones = calcularEstados(gasolineras);
  estaciones.forEach(({ nombre, estado }) => {
    const div = document.createElement('div');
    div.className = 'gasolinera';

    const h3 = document.createElement('h3');
    h3.textContent = nombre;

    const p = document.createElement('p');
    p.textContent = estado;

    div.appendChild(h3);
    div.appendChild(p);
    contenedor.appendChild(div);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const datosDemo = [
      { nombre: 'Gasolinera 1', estaActiva: true },
      { nombre: 'Gasolinera 2', estaActiva: false },
      { nombre: 'Gasolinera 3', estaActiva: true }
    ];
    renderGasolineras(datosDemo);
  });
}