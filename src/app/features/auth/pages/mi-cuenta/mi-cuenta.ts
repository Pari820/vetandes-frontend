import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService, PerfilUsuario } from "../../../../core/auth/auth-service";
import { Permiso } from "../../../../core/auth/auth.model";

interface ModuloPermisos {
  nombre: string;
  permisos: {
    codigo: Permiso;
    descripcion: string;
  }[];
}

@Component({
  selector: "app-mi-cuenta",
  standalone: true,
  templateUrl: "./mi-cuenta.html",
  styleUrl: "./mi-cuenta.css",
})
export class MiCuenta implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly perfil = signal<PerfilUsuario | null>(null);
  readonly cargando = signal(true);
  readonly error = signal("");

  readonly modulos: ModuloPermisos[] = [
    {
      nombre: "Prestaciones",
      permisos: [
        { codigo: "PRESTACION_LEER", descripcion: "Consultar el catálogo" },
        {
          codigo: "PRESTACION_ESCRIBIR",
          descripcion: "Crear, editar, dar de baja o eliminar",
        },
      ],
    },
    {
      nombre: "Mascotas y propietarios",
      permisos: [
        {
          codigo: "MASCOTA_LEER",
          descripcion: "Consultar mascotas y propietarios",
        },
        {
          codigo: "MASCOTA_ESCRIBIR",
          descripcion: "Registrar, editar y eliminar mascotas",
        },
      ],
    },
    {
      nombre: "Atenciones",
      permisos: [
        { codigo: "ATENCION_LEER", descripcion: "Consultar atenciones" },
        { codigo: "ATENCION_REGISTRAR", descripcion: "Registrar atenciones" },
        { codigo: "ATENCION_ANULAR", descripcion: "Anular dentro de 48 horas" },
      ],
    },
    {
      nombre: "Reportes",
      permisos: [
        { codigo: "REPORTE_VER", descripcion: "Ingresos por especie" },
      ],
    },
  ];

  readonly permisosModificados = computed(() => {
    const perfil = this.perfil();
    const sesion = this.auth.sesion();

    if (!perfil || !sesion) {
      return false;
    }

    const permisosServidor = [...perfil.permisos].sort();
    const permisosSesion = [...sesion.permisos].sort();

    return JSON.stringify(permisosServidor) !== JSON.stringify(permisosSesion);
  });

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando.set(true);
    this.error.set("");

    this.auth
      .obtenerPerfil()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (perfil) => {
          this.perfil.set(perfil);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set("No se pudo obtener el perfil desde el servidor.");
          this.cargando.set(false);
        },
      });
  }
}
