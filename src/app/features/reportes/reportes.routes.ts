import { Routes } from "@angular/router";
export const REPORTES_ROUTES: Routes = [
  {
    path: "",
    title: "Reporte por especie",
    loadComponent: () =>
      import("./pages/atenciones-especie/atenciones-especie").then(
        (m) => m.AtencionesEspecie,
      ),
  },
];
