import express from "express";
import { validateData } from "../middleware/validation.middleware";

import {
  specialistSchema,
  updatedSpecialistSchema,
} from "../schema/specialist.schema";
import {
  createSpecialist,
  getSpecialists,
  getSpecialist,
  updateSpecialist,
  deleteSpecialist,
  autoComplete,
  uploadSpecialistPhoto,
  getAllSpecialists
} from "../controllers/specialist.controller";
import { requireAuth } from "@clerk/express";
import upload from "../config/upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Specialists
 *   description: API for managing specialists
 */

/**
 * @swagger
 * /api/v1/specialists:
 *   get:
 *     summary: Get all specialists
 *     tags: [Specialists]
 *     responses:
 *       200:
 *         description: List of specialists
 *   post:
 *     summary: Create a specialist
 *     tags: [Specialists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Specialist'
 *     responses:
 *       201:
 *         description: Specialist created
 */
router
  .route("/")
  .get(getSpecialists)
  .post(requireAuth(), validateData(specialistSchema), createSpecialist);

/**
 * @swagger
 * /api/v1/specialists/autocomplete:
 *   get:
 *     summary: Autocomplete specialists
 *     tags: [Specialists]
 *     responses:
 *       200:
 *         description: List of autocomplete suggestions
 */
router.route("/autocomplete").get(autoComplete);

/**
 * @swagger
 * /api/v1/specialists/all:
 *   get:
 *     summary: Gets all specialists
 *     tags: [Specialists]
 *     responses:
 *       200:
 *         description: List of all sepcialists
 */
router.route("/all").get(getAllSpecialists);

/**
 * @swagger
 * /api/v1/specialists/photo:
 *   post:
 *     summary: Upload specialist photo
 *     tags: [Specialists]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded
 */
router.route("/photo").post(upload.single("photo"), uploadSpecialistPhoto);

/**
 * @swagger
 * /api/v1/specialists/{id}:
 *   get:
 *     summary: Get a specialist by ID
 *     tags: [Specialists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialist details
 *   patch:
 *     summary: Update a specialist
 *     tags: [Specialists]
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
 *             $ref: '#/components/schemas/Specialist'
 *     responses:
 *       200:
 *         description: Specialist updated
 *   delete:
 *     summary: Delete a specialist
 *     tags: [Specialists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialist deleted
 */
router
  .route("/:id")
  .get(getSpecialist)
  .patch(validateData(updatedSpecialistSchema), updateSpecialist)
  .delete(deleteSpecialist);

export default router;
