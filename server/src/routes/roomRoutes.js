import express from "express";
import { createRoom,getRoom,joinRoom,getMyRooms,deactivateRoom,saveCode,updateLanguage,deleteRoom } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createRoom);

router.get("/my-rooms", protect, getMyRooms);

router.post("/join", protect, joinRoom);

router.get("/:roomId", protect, getRoom);

router.patch(
  "/:roomId/deactivate",
  protect,
  deactivateRoom
);

router.put(
  "/:roomId/code",
  protect,
  saveCode
);

router.put(
  "/:roomId/language",
  protect,
  updateLanguage
);

router.delete(
  "/:roomId",
  protect,
  deleteRoom
);
export default router;