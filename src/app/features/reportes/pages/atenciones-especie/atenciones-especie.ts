import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReporteService } from "../../services/reporte-service";
import { ReporteEspecie } from "../../models/reporte.model";
import { mensajeError } from "../../../../core/utils/http-error";
@Component({
  selector: "app-atenciones-especie",
  imports: [FormsModule],
  templateUrl: "./atenciones-especie.html",
  styleUrl: "./atenciones-especie.css",
})
export class AtencionesEspecie implements OnInit {
  private readonly api = inject(ReporteService);
  readonly desde = signal("");
  readonly hasta = signal("");
  readonly registros = signal<ReporteEspecie[]>([]);
  readonly cargando = signal(false);
  readonly error = signal("");
  readonly total = computed(() =>
    this.registros().reduce((s, r) => s + r.importeTotal, 0),
  );
  readonly cantidad = computed(() =>
    this.registros().reduce((s, r) => s + r.cantidadAtenciones, 0),
  );
  readonly maximo = computed(() =>
    Math.max(1, ...this.registros().map((r) => r.importeTotal)),
  );
  ngOnInit() {
    this.cargar();
  }
  imprimir() {
    window.print();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set("");
    this.api.reporte(this.desde(), this.hasta()).subscribe({
      next: (r) => {
        this.registros.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  limpiar() {
    this.desde.set("");
    this.hasta.set("");
    this.cargar();
  }
}
