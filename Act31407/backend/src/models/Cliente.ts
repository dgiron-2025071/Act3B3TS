/**
 * Interface que representa la forma de un Cliente tal como se
 * persiste en clientes.json y se transporta por la API.
 * Todos los atributos usan snake_case según el estándar del proyecto.
 */
export interface IClienteAtributos {
  codigo_cliente: string;
  nombre_cliente: string;
  direccion_cliente: string;
  telefono_cliente: string;
}

/**
 * Clase Cliente (POO).
 * Encapsula los datos de un cliente y expone un método toJSON()
 * para garantizar que siempre se serialice en snake_case.
 */
export class Cliente implements IClienteAtributos {
  codigo_cliente: string;
  nombre_cliente: string;
  direccion_cliente: string;
  telefono_cliente: string;

  constructor(datos: IClienteAtributos) {
    this.codigo_cliente = datos.codigo_cliente;
    this.nombre_cliente = datos.nombre_cliente;
    this.direccion_cliente = datos.direccion_cliente;
    this.telefono_cliente = datos.telefono_cliente;
  }

  toJSON(): IClienteAtributos {
    return {
      codigo_cliente: this.codigo_cliente,
      nombre_cliente: this.nombre_cliente,
      direccion_cliente: this.direccion_cliente,
      telefono_cliente: this.telefono_cliente,
    };
  }
}
