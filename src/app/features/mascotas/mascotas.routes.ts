import { Routes } from "@angular/router";
import { permisoGuard } from "../../core/guards/permiso-guard";
export const MASCOTAS_ROUTES: Routes = [
  {
    path: "",
    title: "Mascotas",
    loadComponent: () =>
      import("./pages/mascota-list/mascota-list").then((m) => m.MascotaList),
  },
  {
    path: "nuevo",
    title: "Nueva mascota",
    canActivate: [permisoGuard],
    data: { permiso: "MASCOTA_ESCRIBIR" },
    loadComponent: () =>
      import("./pages/mascota-form/mascota-form").then((m) => m.MascotaForm),
  },
  {
    path: ":id/editar",
    title: "Editar mascota",
    canActivate: [permisoGuard],
    data: { permiso: "MASCOTA_ESCRIBIR" },
    loadComponent: () =>
      import("./pages/mascota-form/mascota-form").then((m) => m.MascotaForm),
  },
];
