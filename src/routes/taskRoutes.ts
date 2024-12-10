import express from "express";
import { addTask } from "../controllers/taskController";

const router = express.Router();

router.post("/add", addTask);

export default router;
