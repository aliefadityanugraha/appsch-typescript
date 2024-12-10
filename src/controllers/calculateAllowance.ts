import prisma from "../prismaClient";
import moment from "moment";
import { Request, Response, NextFunction } from "express";

export const calculateAllowance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId, month } = req.params;

    const startDate = moment()
      .month(parseInt(month) - 1)
      .startOf("month")
      .toDate();
    const endDate = moment()
      .month(parseInt(month) - 1)
      .endOf("month")
      .toDate();

    const tasks = await prisma.task.findMany({
      where: {
        employeeId: parseInt(employeeId),
        date: { gte: startDate, lte: endDate },
      },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this month" });
    }

    const totalScore = tasks.reduce(
      (sum, task) => sum + task.performanceScore,
      0
    );
    const averageScore = totalScore / tasks.length;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const allowance = averageScore * employee.allowancePerPoint;

    res.status(200).json({
      employee: employee.name,
      month,
      averageScore: averageScore.toFixed(2),
      allowance: allowance.toFixed(2),
    });
  } catch (error) {
    // res.status(500).json({ message: "Error calculating allowance", error });
    next(error);
  }
};

export const getAllAllowances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ambil bulan dari query parameter, default ke bulan ini
    const month = parseInt(req.query.month as string) || moment().month() + 1;

    // Tanggal awal dan akhir bulan
    const startDate = moment()
      .month(month - 1)
      .startOf("month")
      .toDate();
    const endDate = moment()
      .month(month - 1)
      .endOf("month")
      .toDate();

    // Ambil semua karyawan
    const employees = await prisma.employee.findMany({
      include: {
        tasks: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    // Hitung allowance untuk setiap karyawan
    const allowances = employees.map((employee) => {
      const totalScore = employee.tasks.reduce(
        (sum, task) => sum + task.performanceScore,
        0
      );
      const averageScore =
        employee.tasks.length > 0 ? totalScore / employee.tasks.length : 0;
      const allowance = averageScore * employee.allowancePerPoint;

      return {
        employeeId: employee.id,
        name: employee.name,
        position: employee.position,
        averageScore: averageScore.toFixed(2),
        allowance: allowance.toFixed(2),
      };
    });

    res.status(200).json(allowances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching allowances", error });
  }
};
