import { Component, inject, OnInit, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Atencion } from "../../models/atencion.model";
import { AtencionService } from "../../services/atencion-service";
import { AuthService } from "../../../../core/auth/auth-service";
import {
  mensajeError,
  erroresDeValidacion,
} from "../../../../core/utils/http-error";
@Component({
  selector: "app-atencion-detalle",
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: "./atencion-detalle.html",
  styleUrl: "./atencion-detalle.css",
})
export class AtencionDetalle implements OnInit {
  private readonly servicio = inject(AtencionService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly auth = inject(AuthService);
  readonly atencion = signal<Atencion | null>(null);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal("");
  readonly aviso = signal("");
  readonly campos = signal<Record<string, string>>({});
  readonly mostrarAnulacion = signal(false);
  readonly form = this.fb.group({
    motivo: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
  });
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set("");
    this.servicio
      .obtener(Number(this.route.snapshot.paramMap.get("id")))
      .subscribe({
        next: (a) => {
          this.atencion.set(a);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeError(e));
          this.cargando.set(false);
        },
      });
  }
  anular() {
    const a = this.atencion();
    if (!a || this.form.invalid) return;
    this.guardando.set(true);
    this.error.set("");
    this.campos.set({});
    this.servicio
      .anular(a.id, this.form.getRawValue().motivo.trim())
      .subscribe({
        next: (r) => {
          this.atencion.set(r);
          this.mostrarAnulacion.set(false);
          this.aviso.set("Atención anulada correctamente.");
          this.guardando.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.error.set(mensajeError(e));
          this.campos.set(erroresDeValidacion(e));
          this.guardando.set(false);
        },
      });
  }
}
