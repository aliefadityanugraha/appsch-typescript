import prisma from "../prismaClient";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

export const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { name, position, allowancePerPoint } = req.body;

    if (!name || !position || !allowancePerPoint) {
      throw new AppError("All fields are required", 400);
    }

    const employee = await prisma.employee.create({
      data: { name, position, allowancePerPoint },
    });

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await prisma.employee.findMany();
    res.status(200).json({ employees });
  } catch (error) {
    next(error);
  }
};
