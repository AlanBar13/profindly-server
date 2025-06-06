import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors';
import { connectDB } from "./config/database";

import { errorHandler, notFound } from "./middleware/error.middleware";
import { clerkMiddleware } from "@clerk/express";
import swaggerUi from "swagger-ui-express";

import patientRouter from "./routes/patient.route";
import specialistRouter from "./routes/specialist.route";
import matchingRouter from "./routes/matching.route";
import userRouter from "./routes/users.route";
import servicesRouter from "./routes/services.route";
import bookingRouter from "./routes/bookings.route";
import notificationsRouter from "./routes/notifications.route";
import dashboardRouter from "./routes/dashboard.route";
import { swaggerSpec } from "./config/swagger";

const app = express();
const port = Bun.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan(":method :url :status - :response-time ms"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

connectDB();

app.get("/", (req, res) => {
  res.json("Profindly server running!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/specialists", specialistRouter);
app.use("/api/v1/matching", matchingRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
