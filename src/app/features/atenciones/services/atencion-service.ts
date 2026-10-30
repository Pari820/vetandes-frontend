import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Atencion,
  AtencionRequest,
  FiltroAtenciones,
} from "../models/atencion.model";
@Injectable({ providedIn: "root" })
export class AtencionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/atenciones`;
  listar(filtros: FiltroAtenciones = {}): Observable<Atencion[]> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor) params = params.set(clave, valor);
    }
    return this.http.get<Atencion[]>(this.url, { params });
  }
  obtener(id: number): Observable<Atencion> {
    return this.http.get<Atencion>(`${this.url}/${id}`);
  }
  registrar(body: AtencionRequest): Observable<Atencion> {
    return this.http.post<Atencion>(this.url, body);
  }
  anular(id: number, motivo: string): Observable<Atencion> {
    return this.http.patch<Atencion>(`${this.url}/${id}/anular`, { motivo });
  }
}
