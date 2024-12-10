import prisma from "../prismaClient";
import { Request, Response, NextFunction } from "express";

export const periode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json({ message: "Task record added successfully" });
  } catch (error) {
    next(error);
  }
};
