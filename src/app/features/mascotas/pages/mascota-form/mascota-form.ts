import { Observable } from "rxjs";
import { Component, inject, OnInit, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MascotaRequest, Propietario } from "../../models/mascota.model";
import { MascotaService } from "../../services/mascota-service";
import {
  erroresDeValidacion,
  mensajeError,
} from "../../../../core/utils/http-error";
@Component({
  selector: "app-mascota-form",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./mascota-form.html",
  styleUrl: "./mascota-form.css",
})
export class MascotaForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(MascotaService);
  readonly propietarios = signal<Propietario[]>([]);
  readonly id = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal("");
  readonly campos = signal<Record<string, string>>({});
  readonly hoy = new Date().toLocaleDateString("sv-SE");
  readonly form = this.fb.group({
    nombre: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
    ],
    especie: ["PERRO", [Validators.required]],
    raza: ["", [Validators.maxLength(40)]],
    fechaNacimiento: ["", [Validators.required]],
    sexo: ["M", [Validators.required]],
    propietarioId: [0, [Validators.required, Validators.min(1)]],
  });
  ngOnInit() {
    this.service
      .propietarios()
      .subscribe({
        next: (d) => this.propietarios.set(d),
        error: (e) => this.error.set(mensajeError(e)),
      });
    let id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) return;
    this.id.set(id);
    this.cargando.set(true);
    this.service.obtener(id).subscribe({
      next: (m) => {
        this.form.patchValue({
          nombre: m.nombre,
          especie: m.especie,
          raza: m.raza ?? "",
          fechaNacimiento: m.fechaNacimiento,
          sexo: m.sexo,
          propietarioId: m.propietarioId,
        });
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.controls.fechaNacimiento.value > this.hoy) {
      this.error.set("La fecha de nacimiento no puede ser futura.");
      return;
    }
    this.guardando.set(true);
    this.error.set("");
    this.campos.set({});
    let v = this.form.getRawValue();
    const request: MascotaRequest = {
      nombre: v.nombre.trim(),
      especie: v.especie as MascotaRequest["especie"],
      raza: v.raza.trim() || null,
      fechaNacimiento: v.fechaNacimiento,
      sexo: v.sexo as MascotaRequest["sexo"],
      propietarioId: Number(v.propietarioId),
    };
    const llamada: Observable<unknown> = this.id()
      ? this.service.actualizar(this.id()!, request)
      : this.service.crear(request);
    llamada.subscribe({
      next: () => this.router.navigateByUrl("/mascotas"),
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeError(e));
        this.campos.set(erroresDeValidacion(e));
        this.guardando.set(false);
      },
    });
  }
}
