// presenter.js

import { obtenerGasolinerasDisponibles, obtenerStockPorTipo } from './visualizacion.js';

export function renderGasolineras(gasolineras) {
  const contenedor = document.getElementById('gasolineras-lista');
  contenedor.innerHTML = '';

  const activas = obtenerGasolinerasDisponibles(gasolineras);

  activas.forEach(g => {
    const div = document.createElement('div');
    div.className = 'gasolinera';

    const nombre = document.createElement('h3');
    nombre.textContent = g.nombre;

    const stockMagna = document.createElement('p');
    stockMagna.textContent = `Magna: ${obtenerStockPorTipo(g, 'magna')} L`;

    const stockPremium = document.createElement('p');
    stockPremium.textContent = `Premium: ${obtenerStockPorTipo(g, 'premium')} L`;

    const stockDiesel = document.createElement('p');
    stockDiesel.textContent = `Diesel: ${obtenerStockPorTipo(g, 'diesel')} L`;

    div.append(nombre, stockMagna, stockPremium, stockDiesel);
    contenedor.appendChild(div);
  });
}
