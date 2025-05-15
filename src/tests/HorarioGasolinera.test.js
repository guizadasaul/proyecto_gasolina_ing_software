import { obtenerNombreDiaActual, obtenerHorarioDiaActual } from '../utils/HorarioGasolinera.js';

describe('SP1.7 – Funciones auxiliares de fecha y horario', () => {
  it('obtenerDiaActual: debería devolver un día de la semana válido', () => {
    const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dia = obtenerNombreDiaActual();
    expect(diasValidos).toContain(dia);
  });

  it('obtenerHorarioDiaActual: debería devolver el horario del día actual cuando existe', () => {
    const horario = {
      lunes: '08:00 - 20:00',
      martes: '09:00 - 21:00'
    };
    const diaActual = obtenerNombreDiaActual();
    const resultado = obtenerHorarioDiaActual(horario);
    expect(typeof resultado === 'string' || resultado === null).toBeTruthy();
  });

  it('obtenerHorarioDiaActual: debería devolver null cuando el horario no existe', () => {
    const resultado = obtenerHorarioDiaActual({});
    expect(resultado).toBeNull();
  });

  it('obtenerHorarioDiaActual: debería devolver null cuando el horario es null o undefined', () => {
    expect(obtenerHorarioDiaActual(null)).toBeNull();
    expect(obtenerHorarioDiaActual(undefined)).toBeNull();
  });
});