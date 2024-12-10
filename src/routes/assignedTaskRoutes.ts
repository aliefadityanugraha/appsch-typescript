import express from "express";
import {
  addAssignedTask,
  getAssignedTask,
} from "../controllers/assignedTaskController";

const router = express.Router();

router.post("/add", addAssignedTask);
router.get("/all", getAssignedTask);

export default router;
