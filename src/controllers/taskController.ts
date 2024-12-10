import prisma from "../prismaClient";
import { Request, Response, NextFunction } from "express";

export const addTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId, assignedTaskId, date, hoursWorked, performanceScore } =
      req.body;

    const task = await prisma.task.create({
      data: {
        employeeId,
        assignedTaskId,
        date: new Date(),
        hoursWorked,
        performanceScore,
      },
    });

    res.status(201).json({ message: "Task record added successfully", task });
  } catch (error) {
    next(error);
  }
};
