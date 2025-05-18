import { GasolinerasDemo } from '../data/DatosDemo.js';
import {
  getEstacionesActivas,
  validarSeleccion,
  procesarSeleccion
} from '../components/reservation.js';

describe('SP2.1 – Reserva de combustible', () => {
  describe('getEstacionesActivas', () => {
    it('debe retornar todas las estaciones activas con value y label correctos', () => {
      const estaciones = getEstacionesActivas();
      const activas = GasolinerasDemo.filter(e => e.estaActiva);
      expect(estaciones.length).toBe(activas.length);
      expect(estaciones[0]).toEqual({ value: 0, label: activas[0].nombre });
      const lastIndex = activas.length - 1;
      expect(estaciones[lastIndex]).toEqual({
        value: GasolinerasDemo.findIndex(e => e.nombre === activas[lastIndex].nombre),
        label: activas[lastIndex].nombre
      });
    });
  });
});
