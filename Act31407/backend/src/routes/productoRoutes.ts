import { Router } from "express";
import { ProductoController } from "../controllers/ProductoController.js";
import { PersistenceService } from "../persistence/PersistenceService.js";

const router = Router();
const persistencia = new PersistenceService();
const productoController = new ProductoController(persistencia);

router.get("/", productoController.obtenerTodos);
router.post("/", productoController.registrar);

export default router;
