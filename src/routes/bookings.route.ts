import express from "express";
import { requireAuth } from '@clerk/express'
import { validateData } from "../middleware/validation.middleware";
import {
  bookingsSchema,
  updatedBookingsSchema,
} from "../schema/bookings.schema";
import {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getAvailableSlots,
  getCurrentBookings
} from "../controllers/bookings.controller";

const router = express.Router();

router
  .route("/")
  .get(getBookings)
  .post(validateData(bookingsSchema), createBooking);
router.route("/slots").get(getAvailableSlots);
router.route("/current").get(getCurrentBookings);
router.route("/available").get(getAvailableSlots);
router.route("/user").get(requireAuth(), getBooking);
router
  .route("/:id")
  .patch(validateData(updatedBookingsSchema), updateBooking)
  .delete(deleteBooking);

export default router;
