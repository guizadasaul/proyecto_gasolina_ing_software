import { demoStations } from '../data/demoStations.js';
import { filtrarPorCombustible, filtrarPorServicio } from '../utils/filterUtils.js';

describe('SP1.4 – Filtrar gasolineras por tipo de combustible', () => {
  const gasolineras = [
    { nombre: 'G1', estaActiva: true, stock: { magna: 10, premium: 5, diesel: 0 } },
    { nombre: 'G2', estaActiva: true, stock: { magna: 0, premium: 8, diesel: 12 } },
    { nombre: 'G3', estaActiva: true, stock: { magna: 7, premium: 0, diesel: 15 } },
    { nombre: 'G4', estaActiva: false, stock: { magna: 5, premium: 3, diesel: 2 } }
  ];

  it('debería mostrar todas las gasolineras activas cuando el filtro es "todos"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'todos');
    expect(resultado.length).toBe(3);
  });

  it('debería usar "todos" como filtro predeterminado si no se especifica', () => {
    const resultado = filtrarPorCombustible(gasolineras);
    expect(resultado.length).toBe(3);
  });

  it('debería filtrar gasolineras activas con magna disponible cuando el filtro es "magna"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'magna');
    expect(resultado.map(g => g.nombre)).toEqual(['G1', 'G3']);
  });

  it('debería filtrar gasolineras activas con diesel disponible cuando el filtro es "diesel"', () => {
    const resultado = filtrarPorCombustible(gasolineras, 'diesel');
    expect(resultado.map(g => g.nombre)).toEqual(['G2', 'G3']);
  });
});

describe('SP1.8 – Filtrar gasolineras por servicio adicional', () => {
  it('debería devolver solo gasolineras con baños disponibles', () => {
    const resultado = filtrarPorServicio(demoStations, 'banos');
    expect(resultado.every(g => g.servicios?.banos)).toBe(true);
  });

  it('debería devolver solo gasolineras con tienda disponibles', () => {
    const resultado = filtrarPorServicio(demoStations, 'tienda');
    expect(resultado.every(g => g.servicios?.tienda)).toBe(true);
  });

  it('debería devolver solo gasolineras con aire disponibles', () => {
    const resultado = filtrarPorServicio(demoStations, 'aire');
    expect(resultado.every(g => g.servicios?.aire)).toBe(true);
  });
});