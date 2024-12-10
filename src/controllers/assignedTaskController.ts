import prisma from "../prismaClient";
import { Request, Response, NextFunction } from "express";

export const addAssignedTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId, title, description } = req.body;

    const assignedTask = await prisma.assignedTask.create({
      data: { employeeId, title, description },
    });

    res
      .status(201)
      .json({ message: "Assigned task created successfully", assignedTask });
  } catch (error) {
    next(error);
  }
};

export const getAssignedTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignedTask = await prisma.assignedTask.findMany();
    res.status(200).json({ assignedTask });
  } catch (error) {
    next(error);
  }
};
