# VetAndes Web — Examen Parcial II, versión B

Frontend SPA Angular 22 adaptado a VetAndes a partir de la **estructura del proyecto propio PharmaFrontend**: `core/`, `shared/`, `layout/`, `features/`, componentes standalone, archivos `.ts`, `.html` y `.css` independientes y seguridad con signals. Ninguna lista de negocio está escrita a mano.

## Requisitos

- Node.js compatible con Angular 22 (comprueba `node -v`).
- VetAndesBackend iniciado en IntelliJ y escuchando en `http://localhost:8080`.
- Oracle `FREEPDB1`, esquema `VETANDES`, migración Flyway y datos semilla ya cargados por el backend.
- Puerto 4200 libre (cierra el servidor de PharmaSoft o AutoAndesFrontend).

## Arranque en Windows CMD / VS Code

Abre en VS Code la carpeta **`vetandes-frontend`**, la que contiene `angular.json` y `package.json`. En la terminal:

```cmd
npm install
npx ng serve --port 4200
```

Abre **http://localhost:4200/login**.

| Usuario | Contraseña | Rol | Acciones principales |
|---|---|---|---|
| `admin` | `Vet2026*` | ADMIN | Todos los módulos |
| `recepcion` | `Vet2026*` | RECEPCIONISTA | Crear mascotas y atenciones, consultar prestaciones |
| `veterinario` | `Vet2026*` | VETERINARIO | Mantener prestaciones, anular atenciones, reportes; no registra atenciones |
| `inactivo` | `Vet2026*` | RECEPCIONISTA inactivo | Login rechazado (401) |

Estas credenciales corresponden únicamente a los usuarios de prueba del backend.

## Relación con el backend

Configuración `src/environments/environment.ts` y `environment.development.ts`:

```ts
export const environment = { apiUrl: 'http://localhost:8080/api/v1' } as const;
```

Servicios HTTP reales: `PrestacionService`, `MascotaService`, `AtencionService` y `ReporteService`. Los datos de propietarios también provienen de Oracle a través de `GET /propietarios`.

| Pantalla | Método REST | Ruta API |
|---|---|---|
| Login | POST | `/auth/login` |
| Mi cuenta | GET | `/auth/me` |
| Prestaciones | GET/POST, GET/PUT/DELETE/PATCH | `/prestaciones`, `/prestaciones/{id}`, `/prestaciones/{id}/estado` |
| Mascotas | GET/POST, GET/PUT/DELETE | `/mascotas`, `/mascotas/{id}` |
| Propietarios | GET | `/propietarios` |
| Atenciones | GET/POST, GET, PATCH | `/atenciones`, `/atenciones/{id}`, `/atenciones/{id}/anular` |
| Reporte | GET | `/reportes/atenciones-por-especie?desde&hasta` |

Todas las rutas están bajo `/api/v1`. Los campos de los DTO corresponden a la versión de `VetAndesBackend_VersionB.zip` preparada para esta práctica.

## Carpetas

```text
src/app/
  core/auth/                modelo de sesión, AuthService, token JWT
  core/config/menu.ts       menú según permisos
  core/guards/              authGuard, invitadoGuard, permisoGuard
  core/interceptors/        Authorization Bearer y 401/403
  core/utils/http-error.ts  respuesta de error {mensaje, campos}
  layout/                   main-layout, header y sidebar
  shared/                   aviso de vencimiento, directiva si-permiso, 403 y 404
  features/auth/            login y mi cuenta
  features/inicio/          inicio
  features/prestaciones/    lista, formulario reactivo único y servicio
  features/mascotas/        lista, formulario reactivo único y servicio
  features/atenciones/      lista, formulario cabecera-detalle, detalle/anulación y servicio
  features/reportes/        ingresos por especie
```

## Reglas y diseño

- La barra superior tiene **64 px fijos** en `layout/main-layout/main-layout.css` y en `layout/header/header.css`; no cambia al navegar.
- Todos los componentes de presentación mantienen su propio `.css` con reglas reales; no se reemplazaron por archivos de comentario.
- Las rutas usan carga diferida y guards. El login está fuera del layout.
- `AuthService` utiliza signals y `sessionStorage` con `expiraEn`; se cierra al vencer. Se avisa cuando faltan 2 minutos.
- `authInterceptor` agrega Bearer solo a la API, excepto `/auth/login`.
- `errorInterceptor`: 401 de endpoint protegido → cierra sesión con `returnUrl`; 403 → conserva sesión y muestra error.
- Los formularios interpretan `mensaje` y `campos` de los errores 400, 404 y 409 del backend.
- La atención tiene 1–8 líneas, sin duplicados, cantidad 1–3, solo prestaciones activas compatibles con la mascota seleccionada.
- El frontend muestra subtotal/descuento/total **estimados**, con 10 % al seleccionar 3 o más prestaciones distintas. **No envía los importes al backend**: el servicio Spring Boot es autoridad sobre precios y cálculos.
- Los detalles permanecen en el formulario si el backend devuelve 409.
- La anulación solicita un motivo de 10–200 caracteres; el backend aplica la ventana de 48 horas.
- El reporte se obtiene de una consulta agregada JPQL del backend que excluye anuladas.

## Compilación y validación

```cmd
npx ng build
```

Si el CLI informa que necesita una versión más reciente de Node, actualiza Node LTS; si se usan dependencias copiadas de otro sistema operativo, elimina `node_modules` y reinstala con `npm install` en Windows.

El código pasó comprobaciones de **TypeScript** (`tsc --noEmit`) y compilación AOT de plantillas (`ngc --noEmit`) en el entorno de generación. La compilación completa `ng build` y la prueba de integración en tu Windows + Oracle **quedan pendientes**. Ve a `docs/PLAN_PRUEBAS_FRONTEND.md` para verificarlas antes de la entrega.

## Git / entrega

Crea `vetandes-frontend` con ramas `main`, `develop`, `examen-b-pari` (ajusta al apellido del estudiante). Realiza commits auténticos por la pregunta 4, pregunta 5 y correcciones, y etiqueta ambos repositorios `v1.0-examen-u2`. No adjuntes `node_modules`, `.angular/`, `dist/` ni `target/`.
