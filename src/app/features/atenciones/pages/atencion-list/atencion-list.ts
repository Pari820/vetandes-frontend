import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Atencion, FiltroAtenciones } from "../../models/atencion.model";
import { AtencionService } from "../../services/atencion-service";
import { AuthService } from "../../../../core/auth/auth-service";
import { mensajeError } from "../../../../core/utils/http-error";
@Component({
  selector: "app-atencion-list",
  imports: [FormsModule, RouterLink],
  templateUrl: "./atencion-list.html",
  styleUrl: "./atencion-list.css",
})
export class AtencionList implements OnInit {
  private readonly servicio = inject(AtencionService);
  readonly auth = inject(AuthService);
  readonly filas = signal<Atencion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal("");
  readonly filtros: FiltroAtenciones = {
    mascota: "",
    especie: "",
    estado: "",
    desde: "",
    hasta: "",
  };
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.error.set("");
    this.cargando.set(true);
    this.servicio.listar(this.filtros).subscribe({
      next: (r) => {
        this.filas.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  limpiar() {
    this.filtros.mascota = "";
    this.filtros.especie = "";
    this.filtros.estado = "";
    this.filtros.desde = "";
    this.filtros.hasta = "";
    this.cargar();
  }
}
