import { Routes } from "@angular/router";
import { permisoGuard } from "../../core/guards/permiso-guard";
export const ATENCIONES_ROUTES: Routes = [
  {
    path: "",
    title: "Atenciones",
    loadComponent: () =>
      import("./pages/atencion-list/atencion-list").then((m) => m.AtencionList),
  },
  {
    path: "nueva",
    title: "Nueva atención",
    canActivate: [permisoGuard],
    data: { permiso: "ATENCION_REGISTRAR" },
    loadComponent: () =>
      import("./pages/atencion-form/atencion-form").then((m) => m.AtencionForm),
  },
  {
    path: ":id",
    title: "Detalle de atención",
    loadComponent: () =>
      import("./pages/atencion-detalle/atencion-detalle").then(
        (m) => m.AtencionDetalle,
      ),
  },
];
