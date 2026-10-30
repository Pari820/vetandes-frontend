import { Routes } from "@angular/router";
import { MainLayout } from "./layout/main-layout/main-layout";
import { authGuard, invitadoGuard } from "./core/guards/auth-guard";
import { permisoGuard } from "./core/guards/permiso-guard";
export const routes: Routes = [
  {
    path: "login",
    title: "Ingresar | VetAndes",
    canActivate: [invitadoGuard],
    loadComponent: () =>
      import("./features/auth/pages/login/login").then((m) => m.Login),
  },
  {
    path: "",
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "inicio" },
      {
        path: "inicio",
        title: "Inicio",
        loadComponent: () =>
          import("./features/inicio/inicio").then((m) => m.Inicio),
      },
      {
        path: "mi-cuenta",
        title: "Mi cuenta",
        loadComponent: () =>
          import("./features/auth/pages/mi-cuenta/mi-cuenta").then(
            (m) => m.MiCuenta,
          ),
      },
      {
        path: "prestaciones",
        canActivate: [permisoGuard],
        data: { permiso: "PRESTACION_LEER" },
        loadChildren: () =>
          import("./features/prestaciones/prestaciones.routes").then(
            (m) => m.PRESTACIONES_ROUTES,
          ),
      },
      {
        path: "mascotas",
        canActivate: [permisoGuard],
        data: { permiso: "MASCOTA_LEER" },
        loadChildren: () =>
          import("./features/mascotas/mascotas.routes").then(
            (m) => m.MASCOTAS_ROUTES,
          ),
      },
      {
        path: "atenciones",
        canActivate: [permisoGuard],
        data: { permiso: "ATENCION_LEER" },
        loadChildren: () =>
          import("./features/atenciones/atenciones.routes").then(
            (m) => m.ATENCIONES_ROUTES,
          ),
      },
      {
        path: "reportes",
        canActivate: [permisoGuard],
        data: { permiso: "REPORTE_VER" },
        loadChildren: () =>
          import("./features/reportes/reportes.routes").then(
            (m) => m.REPORTES_ROUTES,
          ),
      },
      {
        path: "acceso-denegado",
        title: "Acceso denegado",
        loadComponent: () =>
          import("./shared/pages/acceso-denegado/acceso-denegado").then(
            (m) => m.AccesoDenegado,
          ),
      },
      {
        path: "**",
        title: "No encontrado",
        loadComponent: () =>
          import("./shared/pages/no-encontrado/no-encontrado").then(
            (m) => m.NoEncontrado,
          ),
      },
    ],
  },
  {
    path: "**",
    title: "No encontrado",
    loadComponent: () =>
      import("./shared/pages/no-encontrado/no-encontrado").then(
        (m) => m.NoEncontrado,
      ),
  },
];
