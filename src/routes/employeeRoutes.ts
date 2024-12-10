import express from "express";
import {
  addEmployee,
  getAllEmployees,
} from "../controllers/employeeController";

const router = express.Router();

router.post("/add", addEmployee);
router.get("/all", getAllEmployees);

export default router;
