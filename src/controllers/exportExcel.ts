import prisma from "../prismaClient";
import ExcelJS from "exceljs";
import moment from "moment";
import { Request, Response, NextFunction } from "express";

export const exportExcel = async (
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

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tunjangan Kinerja");

    worksheet.columns = [
      { header: "Tanggal", key: "date", width: 15 },
      { header: "Jam Kerja", key: "hoursWorked", width: 10 },
      { header: "Nilai Tugas", key: "performanceScore", width: 15 },
    ];

    tasks.forEach((task) => {
      worksheet.addRow({
        date: moment(task.date).format("YYYY-MM-DD"),
        hoursWorked: task.hoursWorked,
        performanceScore: task.performanceScore,
      });
    });

    const totalScore = tasks.reduce(
      (sum, task) => sum + task.performanceScore,
      0
    );
    const averageScore = totalScore / tasks.length;
    const allowance = averageScore * employee.allowancePerPoint;

    worksheet.addRow({});
    worksheet.addRow({
      date: "Rata-Rata Nilai",
      hoursWorked: "",
      performanceScore: averageScore.toFixed(2),
    });
    worksheet.addRow({
      date: "Tunjangan Bulanan",
      hoursWorked: "",
      performanceScore: allowance.toFixed(2),
    });

    const fileName = `Tunjangan_${employee.name}_Bulan_${month}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    // res.status(500).json({ message: "Error exporting to Excel", error });
    next(error);
  }
};
