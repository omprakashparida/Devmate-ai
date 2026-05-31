import express from "express";
// import protect from "../middleware/authMiddleware.js";
import {reviewCode,} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post("/review",protect,reviewCode);

export default router;