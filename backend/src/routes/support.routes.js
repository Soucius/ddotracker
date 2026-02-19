import express from "express";
import { sendSupportEmail } from "../controllers/support.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendSupportEmail);

export default router;