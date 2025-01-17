import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/database";

import { errorHandler, notFound } from "./middleware/error.middleware";

import patientRouter from "./routes/patient.route";
import specialistRouter from "./routes/specialist.route";
import matchingRouter from "./routes/matching.route";
import userRouter from "./routes/users.route";
import servicesRouter from "./routes/services.route";
import bookingRouter from "./routes/bookings.route";

const app = express();
const port = Bun.env.PORT || 5000;

app.use(morgan(":method :url :status - :response-time ms"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.json("Profindly server running!");
});

// Routes
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/specialists", specialistRouter);
app.use("/api/v1/matching", matchingRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/bookings", bookingRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
