export type EspeciePrestacion = "PERRO" | "GATO" | "TODAS";
export interface Prestacion {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  especieAplicable: EspeciePrestacion;
  activo: boolean;
}
export type PrestacionRequest = Pick<
  Prestacion,
  "codigo" | "nombre" | "precio" | "especieAplicable"
>;
