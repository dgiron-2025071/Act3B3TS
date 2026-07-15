import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Producto } from "../../models/producto.model";
import { ProductoService } from "../../services/producto.service";

@Component({
  selector: "app-producto-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./producto-list.component.html",
  styleUrls: ["./producto-list.component.css"],
})
export class ProductoListComponent implements OnInit, OnChanges {
  @Input() recargar: unknown;

  productos: Producto[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngOnChanges(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = null;

    this.productoService.obtenerTodos().subscribe({
      next: (datos) => {
        this.productos = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudo cargar la lista de productos.";
        this.cargando = false;
      },
    });
  }
}
