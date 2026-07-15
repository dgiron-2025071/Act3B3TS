import { Request, Response } from "express";
import { PersistenceService } from "../persistence/PersistenceService.js";
import { Cliente, IClienteAtributos } from "../models/Cliente.js";

/**
 * Controlador de Cliente.
 * Contiene la lógica de negocio (validación + orquestación),
 * y delega la lectura/escritura al PersistenceService.
 */
export class ClienteController {
  private persistencia: PersistenceService;

  constructor(persistencia: PersistenceService) {
    this.persistencia = persistencia;
  }

  private validar(datos: Partial<IClienteAtributos>): string[] {
    const errores: string[] = [];

    if (!datos.codigo_cliente || datos.codigo_cliente.toString().trim() === "") {
      errores.push("codigo_cliente es obligatorio.");
    }
    if (!datos.nombre_cliente || datos.nombre_cliente.trim() === "") {
      errores.push("nombre_cliente no puede estar vacío.");
    }
    if (!datos.direccion_cliente || datos.direccion_cliente.trim() === "") {
      errores.push("direccion_cliente no puede estar vacía.");
    }
    if (!datos.telefono_cliente || datos.telefono_cliente.trim() === "") {
      errores.push("telefono_cliente no puede estar vacío.");
    }

    return errores;
  }

  /**
   * POST /clientes
   */
  registrar = async (req: Request, res: Response): Promise<void> => {
    try {
      const errores = this.validar(req.body);
      if (errores.length > 0) {
        res.status(400).json({ mensaje: "Datos de cliente inválidos.", errores });
        return;
      }

      const clientes = await this.persistencia.leer_clientes();

      const yaExiste = clientes.some(
        (c) => c.codigo_cliente === req.body.codigo_cliente
      );
      if (yaExiste) {
        res.status(400).json({
          mensaje: `Ya existe un cliente con el codigo_cliente '${req.body.codigo_cliente}'.`,
        });
        return;
      }

      const nuevoCliente = new Cliente(req.body);
      clientes.push(nuevoCliente.toJSON());

      await this.persistencia.guardar_clientes(clientes);

      res.status(201).json({
        mensaje: "Cliente registrado correctamente.",
        cliente: nuevoCliente.toJSON(),
      });
    } catch (error: any) {
      res.status(500).json({
        mensaje: "Ocurrió un error al registrar el cliente.",
        detalle: error.message,
      });
    }
  };

  /**
   * GET /clientes
   */
  obtenerTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this.persistencia.leer_clientes();
      res.status(200).json(clientes);
    } catch (error: any) {
      res.status(500).json({
        mensaje: "Ocurrió un error al obtener los clientes.",
        detalle: error.message,
      });
    }
  };
}
