import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import clienteRoutes from "./routes/clienteRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/clientes", clienteRoutes);
app.use("/productos", productoRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ mensaje: "API de Clientes y Productos activa." });
});

// Middleware global de manejo de errores no controlados
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ mensaje: "Error interno del servidor.", detalle: err.message });
});

app.listen(PUERTO, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PUERTO}`);
});
