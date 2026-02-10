import express from "express";
import { createMeasure, deleteMeasure, getMeasureById, getMeasures, updateMeasure } from "../controllers/measure.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getMeasures);
router.get("/:id", protect, getMeasureById);
router.post("/", protect, createMeasure);
router.put("/:id", protect, updateMeasure);
router.delete("/:id", protect, deleteMeasure);

export default router;