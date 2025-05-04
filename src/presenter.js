import { calcularEstados, calcularNiveles } from './visualizacion.js';

export function renderGasolineras(gasolineras, filtro = 'todos') {
  const contenedor = document.getElementById('gasolineras-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';

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

    const ul = document.createElement('ul');

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
      { nombre: 'Gasolinera 1', estaActiva: true, direccion: 'av. santa cruz', stock: { magna: 10, premium: 5, diesel: 0 } },
      { nombre: 'Gasolinera 2', estaActiva: false, direccion: 'av. libertador', stock: { magna: 0, premium: 0, diesel: 20 } },
      { nombre: 'Gasolinera 3', estaActiva: true, direccion: 'av. juan de la rosa', stock: { magna: 7, premium: 3, diesel: 1 } },
    ];

    const filtroSelect = document.getElementById('filtro-combustible');
    const aplicarFiltroBtn = document.getElementById('aplicar-filtro');

    aplicarFiltroBtn.addEventListener('click', () => {
      const tipoCombustible = filtroSelect.value;
      renderGasolineras(datosDemo, tipoCombustible);
    });

    renderGasolineras(datosDemo);
  });
}
