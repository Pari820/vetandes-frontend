import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Mascota, Propietario, edadMascota } from "../../models/mascota.model";
import { MascotaService } from "../../services/mascota-service";
import { AuthService } from "../../../../core/auth/auth-service";
import { mensajeError } from "../../../../core/utils/http-error";
@Component({
  selector: "app-mascota-list",
  imports: [FormsModule, RouterLink],
  templateUrl: "./mascota-list.html",
  styleUrl: "./mascota-list.css",
})
export class MascotaList implements OnInit {
  private readonly service = inject(MascotaService);
  readonly auth = inject(AuthService);
  readonly datos = signal<Mascota[]>([]);
  readonly propietarios = signal<Propietario[]>([]);
  readonly propietarioId = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly error = signal("");
  readonly aviso = signal("");
  readonly procesando = signal(false);
  readonly edad = edadMascota;
  ngOnInit() {
    this.service
      .propietarios()
      .subscribe({
        next: (r) => this.propietarios.set(r),
        error: (e) => this.error.set(mensajeError(e)),
      });
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set("");
    this.service.listar(this.propietarioId() ?? undefined).subscribe({
      next: (r) => {
        this.datos.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  cambiarFiltro(valor: string) {
    this.propietarioId.set(valor ? Number(valor) : null);
    this.cargar();
  }
  eliminar(m: Mascota) {
    if (
      !confirm(
        `¿Eliminar a ${m.nombre}? Las mascotas con atenciones no se pueden eliminar.`,
      )
    )
      return;
    this.procesando.set(true);
    this.aviso.set("");
    this.error.set("");
    this.service.eliminar(m.id).subscribe({
      next: () => {
        this.procesando.set(false);
        this.aviso.set("Mascota eliminada.");
        this.cargar();
      },
      error: (e) => {
        this.procesando.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
}
