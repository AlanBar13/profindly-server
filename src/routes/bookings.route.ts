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

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API for managing bookings
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of bookings
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created
 */
router
  .route("/")
  .get(getBookings)
  .post(validateData(bookingsSchema), requireAuth(), createBooking);

/**
 * @swagger
 * /api/v1/bookings/slots:
 *   get:
 *     summary: Get available slots
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of available slots
 */
router.route("/slots").get(getAvailableSlots);

/**
 * @swagger
 * /api/v1/bookings/current:
 *   get:
 *     summary: Get current bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of current bookings
 */
router.route("/current").get(getCurrentBookings);

/**
 * @swagger
 * /api/v1/bookings/available:
 *   get:
 *     summary: Get available slots
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of available slots
 */
router.route("/available").get(getAvailableSlots);

/**
 * @swagger
 * /api/v1/bookings/user:
 *   get:
 *     summary: Get user bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.route("/user").get(requireAuth(), getBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   patch:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 */
router
  .route("/:id")
  .patch(requireAuth(), validateData(updatedBookingsSchema), updateBooking)
  .delete(requireAuth(), deleteBooking);

export default router;
