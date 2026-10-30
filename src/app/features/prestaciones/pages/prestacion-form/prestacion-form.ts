import { Observable } from "rxjs";
import { Component, inject, OnInit, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { PrestacionService } from "../../services/prestacion-service";
import { PrestacionRequest } from "../../models/prestacion.model";
import {
  mensajeError,
  erroresDeValidacion,
} from "../../../../core/utils/http-error";
@Component({
  selector: "app-prestacion-form",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./prestacion-form.html",
  styleUrl: "./prestacion-form.css",
})
export class PrestacionForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PrestacionService);
  readonly id = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal("");
  readonly campos = signal<Record<string, string>>({});
  readonly form = this.fb.group({
    codigo: ["", [Validators.required, Validators.pattern(/^PRS-\d{3}$/)]],
    nombre: [
      "",
      [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
    ],
    precio: [1, [Validators.required, Validators.min(0.01)]],
    especieAplicable: [
      "TODAS",
      [Validators.required, Validators.pattern(/^(PERRO|GATO|TODAS)$/)],
    ],
  });
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) return;
    this.id.set(id);
    this.cargando.set(true);
    this.service.obtener(id).subscribe({
      next: (p) => {
        this.form.patchValue({
          codigo: p.codigo,
          nombre: p.nombre,
          precio: p.precio,
          especieAplicable: p.especieAplicable,
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
    this.guardando.set(true);
    this.error.set("");
    this.campos.set({});
    const request = this.form.getRawValue() as PrestacionRequest;
    const llamada: Observable<unknown> = this.id()
      ? this.service.actualizar(this.id()!, request)
      : this.service.crear(request);
    llamada.subscribe({
      next: () => this.router.navigateByUrl("/prestaciones"),
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeError(e));
        this.campos.set(erroresDeValidacion(e));
        this.guardando.set(false);
      },
    });
  }
}
