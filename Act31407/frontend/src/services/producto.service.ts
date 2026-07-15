import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto } from "../models/producto.model";

@Injectable({ providedIn: "root" })
export class ProductoService {
  private readonly urlBase = "http://localhost:3000/productos";

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlBase);
  }

  registrar(producto: Producto): Observable<any> {
    return this.http.post(this.urlBase, producto);
  }
}
