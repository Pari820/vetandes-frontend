import { Permiso } from "../auth/auth.model";
export interface MenuItem {
  etiqueta: string;
  ruta: string;
  icono: string;
  permiso?: Permiso;
}
export const MENU: MenuItem[] = [
  { etiqueta: "Inicio", ruta: "/inicio", icono: "🏠" },
  {
    etiqueta: "Prestaciones",
    ruta: "/prestaciones",
    icono: "🩺",
    permiso: "PRESTACION_LEER",
  },
  {
    etiqueta: "Mascotas",
    ruta: "/mascotas",
    icono: "🐾",
    permiso: "MASCOTA_LEER",
  },
  {
    etiqueta: "Atenciones",
    ruta: "/atenciones",
    icono: "📋",
    permiso: "ATENCION_LEER",
  },
  {
    etiqueta: "Reportes",
    ruta: "/reportes",
    icono: "📊",
    permiso: "REPORTE_VER",
  },
];
