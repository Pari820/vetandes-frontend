export interface DetalleAtencionRequest {
  prestacionId: number;
  cantidad: number;
}
export interface AtencionRequest {
  mascotaId: number;
  peso: number;
  diagnostico: string;
  detalles: DetalleAtencionRequest[];
}
export interface DetalleAtencion {
  id: number;
  prestacionId: number;
  codigo: string;
  prestacionNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface Atencion {
  id: number;
  numero: string;
  fecha: string;
  mascotaId: number;
  mascotaNombre: string;
  especie: string;
  propietarioNombre: string;
  peso: number;
  diagnostico: string | null;
  estado: "REGISTRADA" | "ANULADA";
  subtotal: number;
  descuento: number;
  total: number;
  usuarioRegistro: string;
  motivoAnulacion: string | null;
  detalles: DetalleAtencion[];
}
export interface FiltroAtenciones {
  mascota?: string;
  especie?: string;
  estado?: string;
  desde?: string;
  hasta?: string;
}
export interface ReporteEspecie {
  especie: string;
  cantidadAtenciones: number;
  importeTotal: number;
}
export function moneda(valor: number): string {
  return `S/ ${Number(valor || 0).toFixed(2)}`;
}
export function redondear2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
