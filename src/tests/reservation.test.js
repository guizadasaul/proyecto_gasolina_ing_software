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
  describe('validarSeleccion', () => {
    it('debe falla si estacionValue no está definido', () => {
      expect(validarSeleccion(null, 'magna', 10)).toEqual({ valid: false, mensaje: 'Por favor selecciona una gasolinera.' });
      expect(validarSeleccion('', 'magna', 10)).toEqual({ valid: false, mensaje: 'Por favor selecciona una gasolinera.' });
    });

    it('debe falla si tipo no está definido', () => {
      expect(validarSeleccion(0, '', 10)).toEqual({ valid: false, mensaje: 'Por favor selecciona un tipo de combustible.' });
    });

    it('debe falla si litros no es número o está fuera de rango', () => {
      expect(validarSeleccion(0, 'diesel', NaN)).toEqual({ valid: false, mensaje: 'Por favor ingresa un valor entre 1 y 50 litros.' });
      expect(validarSeleccion(0, 'diesel', 0)).toEqual({ valid: false, mensaje: 'Por favor ingresa un valor entre 1 y 50 litros.' });
      expect(validarSeleccion(0, 'diesel', 51)).toEqual({ valid: false, mensaje: 'Por favor ingresa un valor entre 1 y 50 litros.' });
    });

    it('debe validar entrada correcta', () => {
      expect(validarSeleccion(0, 'premium', 20)).toEqual({ valid: true, mensaje: '' });
    });
  });
});
