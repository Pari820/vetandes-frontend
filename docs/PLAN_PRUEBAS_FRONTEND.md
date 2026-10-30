# VetAndes Web — Plan de pruebas para el examen (Versión B)

Inicia VetAndesBackend en IntelliJ (puerto 8080) y VetAndesFrontend en VS Code (4200). Verifica Swagger en `http://localhost:8080/swagger-ui.html`. El plan evalúa **comportamiento real**, no solo la compilación.

| Caso | Cuenta | Paso | Resultado observable |
|---|---|---|---|
| 1 | admin | Iniciar sesión | Inicio, Prestaciones, Mascotas, Atenciones, Reportes y Mi cuenta visibles |
| 2 | admin | Abrir Prestaciones, buscar y registrar `PRS-010` | POST 201 y nueva fila visible |
| 3 | admin | Repetir el código `PRS-010` | HTTP 409 con `mensaje` en la página |
| 4 | admin | Editar prestación, dar de baja, reactivar | PUT 204; PATCH 200 con cambio de estado |
| 5 | admin | Eliminar prestación ya usada | HTTP 409; aparece opción alternativa dar de baja |
| 6 | admin | Abrir Mascotas y filtrar por propietario | GET `/mascotas?propietarioId=...`; tabla con nombre, especie, edad y propietario |
| 7 | admin | Registrar mascota con propietario seleccionado | POST 201 desde formulario reactivo |
| 8 | admin | Registrar segunda mascota con mismo nombre y propietario | HTTP 409 sin perder la lista ni bloquear la pantalla |
| 9 | recepcion | Nueva atención, buscar mascota por nombre o propietario | Selección desde backend y prestaciones compatibles |
| 10 | recepcion | Agregar tres prestaciones distintas válidas | Vista previa: descuento 10 %, total = subtotal − descuento |
| 11 | recepcion | Registrar atención | POST 201; número `AT-...`, detalle y total calculados por backend |
| 12 | recepcion | Abrir lista con filtros combinados | GET `/atenciones?mascota&especie&estado&desde&hasta` |
| 13 | veterinario | Entrar a Atenciones | No aparece botón Nueva atención; sí puede consultar |
| 14 | veterinario | Escribir `http://localhost:4200/atenciones/nueva` | Página Acceso denegado; la sesión sigue abierta |
| 15 | veterinario | Abrir detalle de atención reciente registrada y anular | Motivo entre 10–200; PATCH 200 y nuevo estado ANULADA |
| 16 | recepcion | Intentar `PATCH /atenciones/{id}/anular` con su token en Swagger | HTTP 403 (el backend aplica la seguridad) |
| 17 | veterinario | Intentar POST `/mascotas` con su token | HTTP 403; menú no muestra Nuevo |
| 18 | veterinario | Reportes: usar fechas | Solo registro real; suma por especie; excluye ANULADA |
| 19 | admin | `sessionStorage` → `vetandes.sesion` → establecer `expiraEn` en el pasado; F5 | Regresa a Login |
| 20 | admin | Invocar sin token en Swagger y con token modificado | HTTP 401; no 403 |
| 21 | admin | Navegar entre Inicio, Mascotas, Atenciones, Reportes | La cabecera siempre mide 64 px y el menú lateral mantiene su posición |
| 22 | todos | Revisar DevTools (Network) | Todas las listas salen de `http://localhost:8080/api/v1`, nunca de arrays de datos falsos |

## Evidencias recomendadas

Captura: login, CRUD de prestación, CRUD de mascota con propietario, registro de atención de 3 líneas y descuento, detalle de atención, reporte, acceso denegado, respuesta 403 desde Swagger y vencimiento de sesión. Para la P2 del backend demuestra en Oracle que un detalle inválido no deja datos parciales.

## Qué explicar en la defensa

El recorrido de una atención comienza en `AtencionForm` → `AtencionService` → interceptor de autenticación → `AtencionController` → `AtencionServiceImpl` (`@Transactional`) → repositorios JPA → Oracle. El backend consulta precios y calcula la operación; Angular solamente anticipa el monto en pantalla. `authGuard` revisa la sesión, `permisoGuard` protege las rutas y Spring Security vuelve a verificar cada permiso con `hasAuthority`. `errorInterceptor` distingue 401 (credenciales inválidas o sesión vencida) y 403 (usuario autenticado sin permiso) sin cerrar sesión ante 403. `sessionStorage` dura mientras existe la pestaña y contiene el vencimiento del JWT.
