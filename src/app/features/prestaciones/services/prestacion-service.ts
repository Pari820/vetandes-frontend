import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Prestacion, PrestacionRequest } from "../models/prestacion.model";
@Injectable({ providedIn: "root" })
export class PrestacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/prestaciones`;
  listar(especie?: string): Observable<Prestacion[]> {
    let params = new HttpParams();
    if (especie) params = params.set("especie", especie);
    return this.http.get<Prestacion[]>(this.url, { params });
  }
  obtener(id: number): Observable<Prestacion> {
    return this.http.get<Prestacion>(`${this.url}/${id}`);
  }
  crear(body: PrestacionRequest): Observable<Prestacion> {
    return this.http.post<Prestacion>(this.url, body);
  }
  actualizar(id: number, body: PrestacionRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, body);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  cambiarEstado(id: number, activo: boolean): Observable<Prestacion> {
    return this.http.patch<Prestacion>(`${this.url}/${id}/estado`, { activo });
  }
}
