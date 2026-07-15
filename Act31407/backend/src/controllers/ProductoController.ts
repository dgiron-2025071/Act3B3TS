import { Request, Response } from "express";
import { PersistenceService } from "../persistence/PersistenceService.js";
import { Producto, IProductoAtributos } from "../models/Producto.js";

export class ProductoController {
  private persistencia: PersistenceService;

  constructor(persistencia: PersistenceService) {
    this.persistencia = persistencia;
  }

  private validar(datos: Partial<IProductoAtributos>): string[] {
    const errores: string[] = [];

    if (!datos.codigo_producto || datos.codigo_producto.toString().trim() === "") {
      errores.push("codigo_producto es obligatorio.");
    }
    if (!datos.nombre_producto || datos.nombre_producto.trim() === "") {
      errores.push("nombre_producto es obligatorio.");
    }
    if (datos.precio_producto === undefined || Number(datos.precio_producto) <= 0) {
      errores.push("precio_producto debe ser un número mayor que 0.");
    }
    if (datos.stock_producto === undefined || Number(datos.stock_producto) < 0) {
      errores.push("stock_producto debe ser un número mayor o igual a 0.");
    }

    return errores;
  }

  /**
   * POST /productos
   */
  registrar = async (req: Request, res: Response): Promise<void> => {
    try {
      const errores = this.validar(req.body);
      if (errores.length > 0) {
        res.status(400).json({ mensaje: "Datos de producto inválidos.", errores });
        return;
      }

      const productos = await this.persistencia.leer_productos();

      const yaExiste = productos.some(
        (p) => p.codigo_producto === req.body.codigo_producto
      );
      if (yaExiste) {
        res.status(400).json({
          mensaje: `Ya existe un producto con el codigo_producto '${req.body.codigo_producto}'.`,
        });
        return;
      }

      const nuevoProducto = new Producto({
        codigo_producto: req.body.codigo_producto,
        nombre_producto: req.body.nombre_producto,
        precio_producto: Number(req.body.precio_producto),
        stock_producto: Number(req.body.stock_producto),
      });

      productos.push(nuevoProducto.toJSON());
      await this.persistencia.guardar_productos(productos);

      res.status(201).json({
        mensaje: "Producto registrado correctamente.",
        producto: nuevoProducto.toJSON(),
      });
    } catch (error: any) {
      res.status(500).json({
        mensaje: "Ocurrió un error al registrar el producto.",
        detalle: error.message,
      });
    }
  };

  /**
   * GET /productos
   */
  obtenerTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const productos = await this.persistencia.leer_productos();
      res.status(200).json(productos);
    } catch (error: any) {
      res.status(500).json({
        mensaje: "Ocurrió un error al obtener los productos.",
        detalle: error.message,
      });
    }
  };
}
