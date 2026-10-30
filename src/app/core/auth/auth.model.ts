export type Permiso =
  | "PRESTACION_LEER"
  | "PRESTACION_ESCRIBIR"
  | "MASCOTA_LEER"
  | "MASCOTA_ESCRIBIR"
  | "ATENCION_LEER"
  | "ATENCION_REGISTRAR"
  | "ATENCION_ANULAR"
  | "REPORTE_VER";
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEnSegundos: number;
  username: string;
  nombreCompleto: string;
  roles: string[];
  permisos: Permiso[];
}
export interface Sesion {
  token: string;
  expiraEn: number;
  username: string;
  nombreCompleto: string;
  roles: string[];
  permisos: Permiso[];
}
