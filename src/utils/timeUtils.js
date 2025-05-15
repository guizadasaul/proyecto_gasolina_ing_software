export function obtenerDiaActual() {
     const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
     return dias[new Date().getDay()];
}

export function obtenerHorarioDiaActual(horarioSemanal) {
     if (!horarioSemanal) return null;
     const dia = obtenerDiaActual();
     return horarioSemanal[dia] || null;
}

export function estaAbierta(gasolinera) {
     const dia = obtenerDiaActual();
     const horario = gasolinera.horarioSemanal?.[dia]?.toLowerCase();
     if (!horario || horario === 'cerrado') return false;
     if (horario.includes('24 horas')) return true;
     const match = horario.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
     if (!match) return false;
     const [ , hInicio, mInicio, hFin, mFin ] = match.map(Number);
     const ahora = new Date();
     const actualMin = ahora.getHours() * 60 + ahora.getMinutes();
     const inicioMin = hInicio * 60 + mInicio;
     const finMin = hFin * 60 + mFin;
     return actualMin >= inicioMin && actualMin <= finMin;
}