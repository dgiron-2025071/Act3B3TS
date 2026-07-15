import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClienteFormComponent } from "./components/cliente-form/cliente-form.component";
import { ClienteListComponent } from "./components/cliente-list/cliente-list.component";
import { ProductoFormComponent } from "./components/producto-form/producto-form.component";
import { ProductoListComponent } from "./components/producto-list/producto-list.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    ClienteFormComponent,
    ClienteListComponent,
    ProductoFormComponent,
    ProductoListComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  seccionActiva: "clientes" | "productos" = "clientes";

  /** Contadores que se incrementan para forzar la recarga de las tablas */
  recargarClientes = 0;
  recargarProductos = 0;

  cambiarSeccion(seccion: "clientes" | "productos"): void {
    this.seccionActiva = seccion;
  }

  onClienteRegistrado(): void {
    this.recargarClientes++;
  }

  onProductoRegistrado(): void {
    this.recargarProductos++;
  }
}
