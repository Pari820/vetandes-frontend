import { HttpErrorResponse } from "@angular/common/http";
import { ErrorResponse } from "../models/error-response";
export function mensajeError(err: HttpErrorResponse): string {
  if (err.status === 0)
    return "No se puede conectar a VetAndesBackend. Compruebe IntelliJ, Oracle y CORS.";
  const body = err.error as Partial<ErrorResponse> | null;
  return body?.mensaje || `Error ${err.status}: ${err.statusText}`;
}
export function erroresDeValidacion(
  err: HttpErrorResponse,
): Record<string, string> {
  const body = err.error as Partial<ErrorResponse> | null;
  return body?.campos ?? {};
}
