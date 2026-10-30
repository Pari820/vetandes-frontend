import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ReporteEspecie } from "../models/reporte.model";
@Injectable({ providedIn: "root" })
export class ReporteService {
  private readonly http = inject(HttpClient);
  reporte(desde?: string, hasta?: string): Observable<ReporteEspecie[]> {
    let params = new HttpParams();
    if (desde) params = params.set("desde", desde);
    if (hasta) params = params.set("hasta", hasta);
    return this.http.get<ReporteEspecie[]>(
      `${environment.apiUrl}/reportes/atenciones-por-especie`,
      { params },
    );
  }
}
