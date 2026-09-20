/**
 * Regla de dominio: denominación visible de una presentación.
 * La denominación no se persiste: es un Value Object calculado a partir de
 * tipo/quantity/volumen/unidad (depende de cómo se agrupa el producto final).
 * Vive en dominio porque es una regla de negocio del contexto presentación,
 * consumida también por el contexto producto para la denominación automática.
 */
export type TipoPresentacion = 'volume' | 'pack';

const UNIDADES_VALIDAS = new Set(['l', 'ml', 'lt', 'cm3', 'kg', 'g', 'gr', 'cc']);

export function formatearUnidad(unidad: string | null | undefined): string {
  return unidad ? unidad.trim() : '';
}

export function formatearVolumen(volumen: number | null | undefined): string {
  if (volumen == null) return '';
  return String(parseFloat(Number(volumen).toString()));
}

export function normalizarUnidad(unidad: string | null | undefined): string {
  if (!unidad) return '';
  const normalizada = unidad.trim().toLowerCase();
  return UNIDADES_VALIDAS.has(normalizada) ? normalizada : unidad.trim();
}

/**
 * Genera el nombre/denominación visible de una presentación según la combinación:
 * - Volumen: "1L", "500ml"
 * - Pack: "Pack", "Pack x6", "Pack de 2L", "Pack x6 de 500ml"
 */
export function generarDenominacionPresentacion(
  tipo: TipoPresentacion,
  quantity?: number | null,
  volumen?: number | null,
  unidad?: string | null,
): string {
  const vol = formatearVolumen(volumen);
  const uni = formatearUnidad(unidad);
  const volumenTexto = vol && uni ? `${vol}${uni}` : '';

  if (tipo === 'volume') {
    return volumenTexto || 'Volumen';
  }

  const qty = quantity && quantity > 0 ? `x${quantity}` : '';

  if (!qty && !volumenTexto) return 'Pack';
  if (qty && !volumenTexto) return `Pack ${qty}`;
  if (!qty && volumenTexto) return `Pack de ${volumenTexto}`;
  return `Pack ${qty} de ${volumenTexto}`;
}