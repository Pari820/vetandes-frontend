import { Routes } from "@angular/router";
import { permisoGuard } from "../../core/guards/permiso-guard";
export const PRESTACIONES_ROUTES: Routes = [
  {
    path: "",
    title: "Prestaciones",
    loadComponent: () =>
      import("./pages/prestacion-list/prestacion-list").then(
        (m) => m.PrestacionList,
      ),
  },
  {
    path: "nuevo",
    title: "Nueva prestación",
    canActivate: [permisoGuard],
    data: { permiso: "PRESTACION_ESCRIBIR" },
    loadComponent: () =>
      import("./pages/prestacion-form/prestacion-form").then(
        (m) => m.PrestacionForm,
      ),
  },
  {
    path: ":id/editar",
    title: "Editar prestación",
    canActivate: [permisoGuard],
    data: { permiso: "PRESTACION_ESCRIBIR" },
    loadComponent: () =>
      import("./pages/prestacion-form/prestacion-form").then(
        (m) => m.PrestacionForm,
      ),
  },
];
