-- Script de creación de base de datos y tablas para PostgreSQL
-- Nombres en snake_case, replicando exactamente los atributos usados en JSON.

CREATE DATABASE aplicacion_tarea;

-- Conectarse a la base de datos aplicacion_tarea antes de ejecutar lo siguiente.

CREATE TABLE clientes (
    codigo_cliente     VARCHAR(50) PRIMARY KEY,
    nombre_cliente     VARCHAR(150) NOT NULL,
    direccion_cliente  VARCHAR(255) NOT NULL,
    telefono_cliente   VARCHAR(50) NOT NULL
);

CREATE TABLE productos (
    codigo_producto    VARCHAR(50) PRIMARY KEY,
    nombre_producto    VARCHAR(150) NOT NULL,
    precio_producto    NUMERIC(12, 2) NOT NULL CHECK (precio_producto > 0),
    stock_producto     INTEGER NOT NULL CHECK (stock_producto >= 0)
);
