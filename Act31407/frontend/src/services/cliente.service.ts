import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente.model";

@Injectable({ providedIn: "root" })
export class ClienteService {
  private readonly urlBase = "http://localhost:3000/clientes";

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlBase);
  }

  registrar(cliente: Cliente): Observable<any> {
    return this.http.post(this.urlBase, cliente);
  }
}
