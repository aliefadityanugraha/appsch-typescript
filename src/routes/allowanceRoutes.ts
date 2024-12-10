import express, { Request, Response, NextFunction } from "express";
import {
  calculateAllowance,
  getAllAllowances,
} from "../controllers/calculateAllowance";
import { exportExcel } from "../controllers/exportExcel";

const router = express.Router();

router.get(
  "/calculate/:employeeId/:month",
  (req: Request, res: Response, next: NextFunction) => {
    calculateAllowance(req, res, next);
  }
);
router.get(
  "/export/:employeeId/:month",
  (req: Request, res: Response, next: NextFunction) => {
    exportExcel(req, res, next);
  }
);
router.get("/all", getAllAllowances);

export default router;
