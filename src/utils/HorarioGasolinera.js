export function obtenerNombreDiaActual() {
     const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
     return dias[new Date().getDay()];
}

export function obtenerHorarioDiaActual(horarioSemanal) {
     if (!horarioSemanal) return null;
     const diaActual = obtenerNombreDiaActual();
     return horarioSemanal[diaActual] || null;
}

export function gasolineraEstaAbierta(gasolinera) {
     const dia = obtenerNombreDiaActual();
     const horarioTexto = gasolinera.horarioSemanal?.[dia]?.toLowerCase();

     if (!horarioTexto || horarioTexto === 'cerrado') return false;
     if (horarioTexto.includes('24 horas')) return true;

     const match = horarioTexto.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
     if (!match) return false;

     const [ , hInicio, mInicio, hFin, mFin ] = match.map(Number);

     const ahora = new Date();
     const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
     const minutosInicio = hInicio * 60 + mInicio;
     const minutosFin = hFin * 60 + mFin;
     
     return minutosActuales >= minutosInicio && minutosActuales <= minutosFin;
}