import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Mascota, MascotaRequest, Propietario } from "../models/mascota.model";
@Injectable({ providedIn: "root" })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mascotas`;
  listar(propietarioId?: number): Observable<Mascota[]> {
    const params = propietarioId
      ? new HttpParams().set("propietarioId", propietarioId)
      : undefined;
    return this.http.get<Mascota[]>(this.url, { params });
  }
  obtener(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.url}/${id}`);
  }
  crear(body: MascotaRequest): Observable<Mascota> {
    return this.http.post<Mascota>(this.url, body);
  }
  actualizar(id: number, body: MascotaRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, body);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  propietarios(): Observable<Propietario[]> {
    return this.http.get<Propietario[]>(`${environment.apiUrl}/propietarios`);
  }
}
