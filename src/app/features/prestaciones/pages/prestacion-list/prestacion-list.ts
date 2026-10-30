import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { Prestacion, EspeciePrestacion } from "../../models/prestacion.model";
import { PrestacionService } from "../../services/prestacion-service";
import { AuthService } from "../../../../core/auth/auth-service";
import { mensajeError } from "../../../../core/utils/http-error";
@Component({
  selector: "app-prestacion-list",
  imports: [FormsModule, RouterLink],
  templateUrl: "./prestacion-list.html",
  styleUrl: "./prestacion-list.css",
})
export class PrestacionList implements OnInit {
  private readonly service = inject(PrestacionService);
  protected readonly auth = inject(AuthService);
  readonly prestaciones = signal<Prestacion[]>([]);
  readonly cargando = signal(false);
  readonly procesando = signal<number | null>(null);
  readonly error = signal("");
  readonly aviso = signal("");
  readonly texto = signal("");
  readonly especie = signal("");
  readonly filtradas = computed(() =>
    this.prestaciones().filter((p) =>
      (p.codigo + " " + p.nombre)
        .toLocaleLowerCase()
        .includes(this.texto().trim().toLocaleLowerCase()),
    ),
  );
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set("");
    this.service.listar(this.especie()).subscribe({
      next: (datos) => {
        this.prestaciones.set(datos);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  estado(p: Prestacion) {
    if (
      p.activo &&
      !confirm(
        `¿Dar de baja la prestación ${p.codigo}? No podrá elegirse en nuevas atenciones.`,
      )
    )
      return;
    this.procesando.set(p.id);
    this.error.set("");
    this.aviso.set("");
    this.service.cambiarEstado(p.id, !p.activo).subscribe({
      next: () => {
        this.aviso.set("Estado actualizado.");
        this.procesando.set(null);
        this.cargar();
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.procesando.set(null);
      },
    });
  }
  eliminar(p: Prestacion) {
    if (
      !confirm(
        `¿Eliminar la prestación ${p.codigo}? Si ya tiene atenciones, el servidor responderá 409 y se puede dar de baja.`,
      )
    )
      return;
    this.procesando.set(p.id);
    this.error.set("");
    this.aviso.set("");
    this.service.eliminar(p.id).subscribe({
      next: () => {
        this.procesando.set(null);
        this.aviso.set("Prestación eliminada.");
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        this.procesando.set(null);
        this.error.set(
          e.status === 409
            ? `${mensajeError(e)} Puede utilizar «Dar de baja».`
            : mensajeError(e),
        );
      },
    });
  }
}
