import express from "express";
import bodyParser, { json } from "body-parser";
import employeeRoutes from "./routes/employeeRoutes";
import assignedTaskRoutes from "./routes/assignedTaskRoutes";
import taskRoutes from "./routes/taskRoutes";
import errorHandler from "./middleware/errorHandler";
import allowanceRoutes from "./routes/allowanceRoutes";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/employee", employeeRoutes);
app.use("/assignedTask", assignedTaskRoutes);
app.use("/task", taskRoutes);
app.use("/allowance", allowanceRoutes);

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

// Error Handler
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
