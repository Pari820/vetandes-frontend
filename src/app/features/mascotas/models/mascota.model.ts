export type EspecieMascota = "PERRO" | "GATO" | "OTRO";
export interface Propietario {
  id: number;
  dni: string;
  nombres: string;
  telefono: string | null;
}
export interface Mascota {
  id: number;
  nombre: string;
  especie: EspecieMascota;
  raza: string | null;
  fechaNacimiento: string;
  sexo: "M" | "H";
  propietarioId: number;
  propietarioNombre: string;
}
export type MascotaRequest = Pick<
  Mascota,
  "nombre" | "especie" | "raza" | "fechaNacimiento" | "sexo" | "propietarioId"
>;
export function edadMascota(fecha: string): string {
  if (!fecha) return "—";
  const n = new Date(fecha + "T00:00:00");
  if (Number.isNaN(n.getTime())) return "—";
  const ahora = new Date();
  let meses =
    (ahora.getFullYear() - n.getFullYear()) * 12 +
    ahora.getMonth() -
    n.getMonth();
  if (ahora.getDate() < n.getDate()) meses--;
  if (meses < 0) return "—";
  if (meses < 12) return `${meses} mes${meses === 1 ? "" : "es"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} año${anos === 1 ? "" : "s"}`;
}
