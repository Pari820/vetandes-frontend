import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormArray,
  FormGroup,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Mascota } from "../../../mascotas/models/mascota.model";
import { MascotaService } from "../../../mascotas/services/mascota-service";
import { Prestacion } from "../../../prestaciones/models/prestacion.model";
import { PrestacionService } from "../../../prestaciones/services/prestacion-service";
import {
  Atencion,
  AtencionRequest,
  redondear2,
} from "../../models/atencion.model";
import { AtencionService } from "../../services/atencion-service";
import {
  mensajeError,
  erroresDeValidacion,
} from "../../../../core/utils/http-error";
@Component({
  selector: "app-atencion-form",
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: "./atencion-form.html",
  styleUrl: "./atencion-form.css",
})
export class AtencionForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly mascotasApi = inject(MascotaService);
  private readonly prestacionesApi = inject(PrestacionService);
  private readonly atencionesApi = inject(AtencionService);
  readonly mascotas = signal<Mascota[]>([]);
  readonly prestaciones = signal<Prestacion[]>([]);
  readonly seleccionada = signal<Mascota | null>(null);
  readonly busqueda = signal("");
  readonly mostrarResultados = signal(true);
  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly error = signal("");
  readonly campos = signal<Record<string, string>>({});
  readonly registrada = signal<Atencion | null>(null);
  private readonly revision = signal(0);
  readonly form = this.fb.group({
    mascotaId: [0, [Validators.required, Validators.min(1)]],
    peso: [0, [Validators.required, Validators.min(0.01)]],
    diagnostico: ["", [Validators.maxLength(300)]],
    detalles: this.fb.array<FormGroup>([this.nuevaLinea()]),
  });
  get detalles(): FormArray<FormGroup> {
    return this.form.controls.detalles;
  }
  readonly buscadas = computed(() => {
    const q = this.busqueda().trim().toLocaleLowerCase();
    if (!q) return this.mascotas().slice(0, 20);
    return this.mascotas()
      .filter((m) =>
        `${m.nombre} ${m.propietarioNombre} ${m.especie}`
          .toLocaleLowerCase()
          .includes(q),
      )
      .slice(0, 20);
  });
  readonly compatibles = computed(() => {
    const m = this.seleccionada();
    return this.prestaciones().filter(
      (p) =>
        p.activo &&
        !!m &&
        (p.especieAplicable === "TODAS" || p.especieAplicable === m.especie),
    );
  });
  readonly calculo = computed(() => {
    this.revision();
    const datos = this.detalles.getRawValue() as {
      prestacionId: number;
      cantidad: number;
    }[];
    const precios = this.compatibles();
    const validos = datos.filter(
      (d) =>
        d["prestacionId"] > 0 &&
        d["cantidad"] >= 1 &&
        d["cantidad"] <= 3 &&
        precios.some((p) => p.id === Number(d["prestacionId"])),
    );
    const subtotal = redondear2(
      validos.reduce(
        (acc, d) =>
          acc +
          (precios.find((p) => p.id === Number(d["prestacionId"]))?.precio ??
            0) *
            d["cantidad"],
        0,
      ),
    );
    const distintos = new Set(validos.map((d) => Number(d["prestacionId"])))
      .size;
    const descuento = distintos >= 3 ? redondear2(subtotal * 0.1) : 0;
    return {
      subtotal,
      descuento,
      total: redondear2(subtotal - descuento),
      distintos,
    };
  });
  readonly repetidos = computed(() => {
    this.revision();
    const ids = this.detalles
      .getRawValue()
      .map((d) => Number(d["prestacionId"]))
      .filter((id) => id > 0);
    return new Set(ids).size !== ids.length;
  });
  readonly incompatible = computed(() => {
    this.revision();
    const ids = this.compatibles().map((p) => p.id);
    return this.detalles
      .getRawValue()
      .some(
        (d) =>
          Number(d["prestacionId"]) > 0 &&
          !ids.includes(Number(d["prestacionId"])),
      );
  });
  ngOnInit() {
    this.form.valueChanges.subscribe(() => this.revision.update((v) => v + 1));
    let faltan = 2;
    const fin = () => {
      if (--faltan === 0) this.cargando.set(false);
    };
    this.mascotasApi.listar().subscribe({
      next: (rs) => {
        this.mascotas.set(rs);
        fin();
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        fin();
      },
    });
    this.prestacionesApi.listar().subscribe({
      next: (rs) => {
        this.prestaciones.set(rs);
        fin();
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        fin();
      },
    });
  }
  private nuevaLinea(): FormGroup {
    return this.fb.group({
      prestacionId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [
        1,
        [Validators.required, Validators.min(1), Validators.max(3)],
      ],
    });
  }
  elegirMascota(m: Mascota) {
    const anterior = this.seleccionada();
    this.seleccionada.set(m);
    this.form.controls.mascotaId.setValue(m.id);
    this.busqueda.set(`${m.nombre} · ${m.propietarioNombre}`);
    this.mostrarResultados.set(false);
    if (anterior?.especie !== m.especie) {
      this.detalles.clear();
      this.detalles.push(this.nuevaLinea());
    }
  }
  quitarMascota() {
    this.seleccionada.set(null);
    this.form.controls.mascotaId.setValue(0);
    this.busqueda.set("");
    this.mostrarResultados.set(true);
    this.detalles.clear();
    this.detalles.push(this.nuevaLinea());
  }
  agregar() {
    if (this.detalles.length < 8) {
      this.detalles.push(this.nuevaLinea());
      this.revision.update((v) => v + 1);
    }
  }
  quitar(i: number) {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(i);
      this.revision.update((v) => v + 1);
    }
  }
  enOtraLinea(id: number, indice: number): boolean {
    return this.detalles.controls.some(
      (g, i) => i !== indice && Number(g.get("prestacionId")?.value) === id,
    );
  }
  precio(id: number): number {
    return this.compatibles().find((p) => p.id === Number(id))?.precio ?? 0;
  }
  subtotalLinea(i: number): number {
    const g = this.detalles.at(i);
    return redondear2(
      this.precio(Number(g.get("prestacionId")?.value)) *
        Number(g.get("cantidad")?.value),
    );
  }
  registrar() {
    if (
      this.form.invalid ||
      !this.seleccionada() ||
      this.repetidos() ||
      this.incompatible() ||
      this.detalles.length > 8
    ) {
      this.form.markAllAsTouched();
      this.error.set(
        "Revise la mascota, peso, cantidades y servicios sin repetir antes de registrar.",
      );
      return;
    }
    this.enviando.set(true);
    this.error.set("");
    this.campos.set({});
    const v = this.form.getRawValue();
    const payload: AtencionRequest = {
      mascotaId: Number(v.mascotaId),
      peso: Number(v.peso),
      diagnostico: v.diagnostico.trim(),
      detalles: v.detalles.map((d) => ({
        prestacionId: Number(d["prestacionId"]),
        cantidad: Number(d["cantidad"]),
      })),
    };
    this.atencionesApi.registrar(payload).subscribe({
      next: (r) => {
        this.registrada.set(r);
        this.enviando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeError(e));
        this.campos.set(erroresDeValidacion(e));
        this.enviando.set(false);
      },
    });
  }
}
