import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { IClienteAtributos } from "../models/Cliente.js";
import { IProductoAtributos } from "../models/Producto.js";

/**
 * Módulo exclusivo de persistencia.
 *
 * Responsabilidad única: leer y escribir los archivos JSON en /data.
 * NO contiene lógica de negocio ni validaciones: eso vive en los
 * controllers. Esto es lo que permite, el día de mañana, reemplazar
 * esta clase por una implementación con PostgreSQL (pg) sin tocar
 * ClienteController ni ProductoController, siempre que se respeten
 * las mismas firmas de método (leer_clientes, guardar_clientes, etc).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RUTA_CLIENTES = path.join(__dirname, "..", "..", "data", "clientes.json");
const RUTA_PRODUCTOS = path.join(__dirname, "..", "..", "data", "productos.json");

export class PersistenceService {
  /**
   * Lee un archivo JSON de forma segura.
   * Si el archivo no existe o está vacío, retorna un arreglo vacío.
   * Si el JSON está corrupto, lanza un error controlado y descriptivo.
   */
  private async leerArchivoJSON<T>(rutaArchivo: string): Promise<T[]> {
    try {
      const contenido = await readFile(rutaArchivo, "utf-8");

      if (!contenido || contenido.trim().length === 0) {
        return [];
      }

      try {
        return JSON.parse(contenido) as T[];
      } catch (errorParseo) {
        throw new Error(
          `El archivo ${path.basename(rutaArchivo)} contiene un JSON corrupto y no pudo ser interpretado.`
        );
      }
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // El archivo aún no existe: se trata como una colección vacía.
        return [];
      }
      if (error.code === "EACCES") {
        throw new Error(
          `No hay permisos suficientes para leer el archivo ${path.basename(rutaArchivo)}.`
        );
      }
      throw error;
    }
  }

  /**
   * Escribe un archivo JSON de forma segura.
   */
  private async escribirArchivoJSON<T>(rutaArchivo: string, datos: T[]): Promise<void> {
    try {
      const contenido = JSON.stringify(datos, null, 2);
      await writeFile(rutaArchivo, contenido, "utf-8");
    } catch (error: any) {
      if (error.code === "EACCES") {
        throw new Error(
          `No hay permisos suficientes para escribir el archivo ${path.basename(rutaArchivo)}.`
        );
      }
      throw new Error(
        `Ocurrió un error al escribir el archivo ${path.basename(rutaArchivo)}: ${error.message}`
      );
    }
  }

  // ----------------- Clientes -----------------

  async leer_clientes(): Promise<IClienteAtributos[]> {
    return this.leerArchivoJSON<IClienteAtributos>(RUTA_CLIENTES);
  }

  async guardar_clientes(clientes: IClienteAtributos[]): Promise<void> {
    await this.escribirArchivoJSON<IClienteAtributos>(RUTA_CLIENTES, clientes);
  }

  // ----------------- Productos -----------------

  async leer_productos(): Promise<IProductoAtributos[]> {
    return this.leerArchivoJSON<IProductoAtributos>(RUTA_PRODUCTOS);
  }

  async guardar_productos(productos: IProductoAtributos[]): Promise<void> {
    await this.escribirArchivoJSON<IProductoAtributos>(RUTA_PRODUCTOS, productos);
  }
}
