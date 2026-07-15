import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductoService } from "../../services/producto.service";

@Component({
  selector: "app-producto-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./producto-form.component.html",
  styleUrls: ["./producto-form.component.css"],
})
export class ProductoFormComponent {
  @Output() productoRegistrado = new EventEmitter<void>();

  formulario: FormGroup;
  mensajeExito: string | null = null;
  erroresServidor: string[] = [];

  constructor(private fb: FormBuilder, private productoService: ProductoService) {
    this.formulario = this.fb.group({
      codigo_producto: ["", Validators.required],
      nombre_producto: ["", Validators.required],
      precio_producto: [null, [Validators.required, Validators.min(0.01)]],
      stock_producto: [null, [Validators.required, Validators.min(0)]],
    });
  }

  guardar(): void {
    this.mensajeExito = null;
    this.erroresServidor = [];

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.productoService.registrar(this.formulario.value).subscribe({
      next: () => {
        this.mensajeExito = "Producto registrado correctamente.";
        this.formulario.reset();
        this.productoRegistrado.emit();
      },
      error: (error) => {
        this.erroresServidor = error?.error?.errores ?? [
          error?.error?.mensaje ?? "Ocurrió un error al registrar el producto.",
        ];
      },
    });
  }
}
