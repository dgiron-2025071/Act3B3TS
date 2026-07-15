export interface IProductoAtributos {
  codigo_producto: string;
  nombre_producto: string;
  precio_producto: number;
  stock_producto: number;
}

export class Producto implements IProductoAtributos {
  codigo_producto: string;
  nombre_producto: string;
  precio_producto: number;
  stock_producto: number;

  constructor(datos: IProductoAtributos) {
    this.codigo_producto = datos.codigo_producto;
    this.nombre_producto = datos.nombre_producto;
    this.precio_producto = datos.precio_producto;
    this.stock_producto = datos.stock_producto;
  }

  toJSON(): IProductoAtributos {
    return {
      codigo_producto: this.codigo_producto,
      nombre_producto: this.nombre_producto,
      precio_producto: this.precio_producto,
      stock_producto: this.stock_producto,
    };
  }
}
