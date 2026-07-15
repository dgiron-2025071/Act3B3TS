import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cliente } from "../../models/cliente.model";
import { ClienteService } from "../../services/cliente.service";

@Component({
  selector: "app-cliente-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./cliente-list.component.html",
  styleUrls: ["./cliente-list.component.css"],
})
export class ClienteListComponent implements OnInit, OnChanges {
  /** Cambia este valor desde el padre (ej. incrementando un contador) para forzar recarga */
  @Input() recargar: unknown;

  clientes: Cliente[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnChanges(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.error = null;

    this.clienteService.obtenerTodos().subscribe({
      next: (datos) => {
        this.clientes = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudo cargar la lista de clientes.";
        this.cargando = false;
      },
    });
  }
}
