import { calcularEstados, calcularNiveles } from './visualizacion.js';

export function renderGasolineras(gasolineras) {
  const contenedor = document.getElementById('gasolineras-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';

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

    const ul = document.createElement('ul');
    const nivelActual = niveles.find(n => n.nombre === estacion.nombre);

    if (nivelActual) {
      for (const [tipo, litros] of Object.entries(nivelActual.niveles)) {
        const li = document.createElement('li');
        li.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${litros} L`;

        if (litros === 0) {
          li.style.color = 'red'; // Pintar en rojo si el nivel es 0
        }

        ul.appendChild(li);
      }
    }

    div.appendChild(ul);
    contenedor.appendChild(div);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const datosDemo = [
      { nombre: 'Gasolinera 1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'Gasolinera 2', estaActiva: false, stock: { magna: 0, premium: 0, diesel: 20 } },
      { nombre: 'Gasolinera 3', estaActiva: true, stock: { magna: 7, premium: 3, diesel: 1 } },
    ];
    renderGasolineras(datosDemo);
  });
}
