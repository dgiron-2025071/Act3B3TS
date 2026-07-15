# Aplicación de Gestión de Clientes y Productos

## 1. Objetivo del proyecto

Sistema full-stack que permite **registrar y consultar clientes y productos**,
con persistencia asíncrona en archivos **JSON** (`fs/promises`) en el backend,
y una interfaz **Angular** para operarlo. La arquitectura está diseñada para
migrar en el futuro a **PostgreSQL** sin tocar la lógica de negocio.

## 2. Arquitectura

```
Aplicacion-tarea/
├── backend/
│   ├── src/
│   │   ├── models/         → Cliente.ts, Producto.ts (interface + clase)
│   │   ├── persistence/    → PersistenceService.ts (único punto que toca fs/promises)
│   │   ├── controllers/    → ClienteController.ts, ProductoController.ts (lógica + validación)
│   │   ├── routes/         → clienteRoutes.ts, productoRoutes.ts (Express Router)
│   │   └── app.ts          → arranque del servidor Express
│   ├── data/                → clientes.json, productos.json
│   └── sql/script.sql       → script de migración a PostgreSQL
└── frontend/
    └── src/
        ├── models/          → interfaces TypeScript (replican al backend)
        ├── services/        → ClienteService, ProductoService (HttpClient)
        ├── components/      → cliente-form, cliente-list, producto-form, producto-list
        └── app.component.*  → componente raíz standalone
```

Patrón **MVC + capa de persistencia separada**:
`Route → Controller (validación + orquestación) → PersistenceService (lectura/escritura)`.
Ningún controller usa `readFile`/`writeFile` directamente.

## 3. Tecnologías

- **Backend:** Node.js, Express, TypeScript (ES Modules), `fs/promises`.
- **Frontend:** Angular 18 (componentes standalone), Reactive Forms, HttpClient.
- **Base de datos futura:** PostgreSQL.

## 4. Instalación

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 5. Ejecución

### Backend (puerto 3000)
```bash
cd backend
npm run dev      # con tsx watch (desarrollo)
# o
npm run build && npm start   # compilado
```

### Frontend (puerto 4200)
```bash
cd frontend
npm start
```

La app consume la API en `http://localhost:3000`.

## 6. Módulo de persistencia y uso de `fs/promises`

`PersistenceService` es la **única** clase que importa `readFile`/`writeFile`
de `fs/promises`. Expone:

- `leer_clientes()` / `guardar_clientes()`
- `leer_productos()` / `guardar_productos()`

Todo es `async/await`. Si el archivo no existe, se trata como colección
vacía; si el JSON está corrupto o hay problemas de permisos, se lanza un
error descriptivo que el controller convierte en una respuesta HTTP clara.

## 7. Validaciones

**Cliente:** `codigo_cliente`, `nombre_cliente`, `direccion_cliente` y
`telefono_cliente` son obligatorios y no pueden estar vacíos.

**Producto:** `codigo_producto` y `nombre_producto` obligatorios;
`precio_producto > 0`; `stock_producto >= 0`.

Cualquier violación retorna **HTTP 400** con el detalle de cada error.

## 8. Manejo de errores

Todas las operaciones están envueltas en `try/catch`. Se contemplan:
archivo inexistente, JSON corrupto, permisos insuficientes, error de
escritura/lectura y datos inválidos. La aplicación nunca se cae: siempre
responde con un código HTTP y un mensaje claro.

## 9. Flujo completo

1. El usuario llena el formulario Angular (`cliente-form` / `producto-form`).
2. El formulario valida en el cliente (Reactive Forms) antes de enviar.
3. El `Service` de Angular hace `POST` a la API Express.
4. El `Controller` valida de nuevo en el servidor y delega en
   `PersistenceService`.
5. `PersistenceService` lee el JSON actual, agrega el nuevo registro y
   reescribe el archivo.
6. La lista (`cliente-list` / `producto-list`) se recarga automáticamente
   vía `GET`.

## 10. PostgreSQL: migración futura

El script `backend/sql/script.sql` crea la base `aplicacion_tarea` y las
tablas `clientes` y `productos` con exactamente los mismos nombres de
columna (snake_case) que usan los archivos JSON.

Como `ClienteController` y `ProductoController` sólo dependen de los
métodos `leer_*` / `guardar_*` de `PersistenceService` (nunca de `fs`
directamente), migrar a PostgreSQL consiste en crear una nueva clase,
por ejemplo `PostgresPersistenceService`, que implemente los mismos
métodos usando `pg`, y sustituirla en las rutas. **La lógica de negocio
de los controllers no cambia.**

## 11. Casos de prueba

| # | Caso | Comportamiento esperado |
|---|------|--------------------------|
| 1 | Registrar cliente correctamente | `201`, cliente guardado en `clientes.json` |
| 2 | Registrar producto correctamente | `201`, producto guardado en `productos.json` |
| 3 | Leer clientes (`GET /clientes`) | `200` con arreglo de clientes |
| 4 | Leer productos (`GET /productos`) | `200` con arreglo de productos |
| 5 | Archivo inexistente | Se trata como `[]`, no lanza excepción |
| 6 | Archivo vacío | Se trata como `[]` |
| 7 | JSON corrupto | `500` con mensaje "JSON corrupto" controlado |
| 8 | Datos inválidos (campo vacío, precio ≤ 0, etc.) | `400` con arreglo de `errores` |
| 9 | Error de permisos al escribir/leer | `500` con mensaje de permisos |

## 12. Mejoras futuras

- Autenticación y autorización (JWT).
- Migración real a PostgreSQL usando el mismo contrato de `PersistenceService`.
- Edición y eliminación de registros (`PUT` / `DELETE`).
- Paginación y búsqueda en las tablas del frontend.
- Pruebas automatizadas (Jest / Jasmine + Karma).
