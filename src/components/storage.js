import { GasolinerasDemo as DatosOriginales } from '../data/DatosDemo.js';

const STORAGE_KEY = 'gasolineras';

export function cargarGasolineras() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      console.warn('Error al parsear localStorage. Usando valores originales.');
    }
  }
  return structuredClone(DatosOriginales);
}

export function guardarGasolineras(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetearGasolineras() {
  localStorage.removeItem(STORAGE_KEY);
}

const STORAGE_COMPROBANTE_KEY = 'comprobanteActual';

export function guardarComprobanteActual(comprobante) {
  localStorage.setItem(STORAGE_COMPROBANTE_KEY, JSON.stringify(comprobante));
}

export function cargarComprobanteActual() {
  const raw = localStorage.getItem(STORAGE_COMPROBANTE_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

