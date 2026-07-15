import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClienteService } from "../../services/cliente.service";

@Component({
  selector: "app-cliente-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./cliente-form.component.html",
  styleUrls: ["./cliente-form.component.css"],
})
export class ClienteFormComponent {
  @Output() clienteRegistrado = new EventEmitter<void>();

  formulario: FormGroup;
  mensajeExito: string | null = null;
  erroresServidor: string[] = [];

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.formulario = this.fb.group({
      codigo_cliente: ["", Validators.required],
      nombre_cliente: ["", Validators.required],
      direccion_cliente: ["", Validators.required],
      telefono_cliente: ["", Validators.required],
    });
  }

  guardar(): void {
    this.mensajeExito = null;
    this.erroresServidor = [];

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.clienteService.registrar(this.formulario.value).subscribe({
      next: () => {
        this.mensajeExito = "Cliente registrado correctamente.";
        this.formulario.reset();
        this.clienteRegistrado.emit();
      },
      error: (error) => {
        this.erroresServidor = error?.error?.errores ?? [
          error?.error?.mensaje ?? "Ocurrió un error al registrar el cliente.",
        ];
      },
    });
  }
}
