import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController.js";
import { PersistenceService } from "../persistence/PersistenceService.js";

const router = Router();
const persistencia = new PersistenceService();
const clienteController = new ClienteController(persistencia);

router.get("/", clienteController.obtenerTodos);
router.post("/", clienteController.registrar);

export default router;
