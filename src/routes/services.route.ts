import express from "express";
import { validateData } from "../middleware/validation.middleware";
import {
  servicesSchema,
  updatedServiceSchema,
} from "../schema/services.schema";
import {
  createorUpdateService,
  getServices,
  getService,
  updateService,
  deleteService,
  getServicesBySpecialist,
  getSpecialistService,
} from "../controllers/services.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API for managing services
 */

/**
 * @swagger
 * /api/v1/services/specialist:
 *   get:
 *     summary: Get services for the authenticated specialist
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services for the authenticated specialist
 */
router.route("/specialist").get(requireAuth(), getSpecialistService);

/**
 * @swagger
 * /api/v1/services/specialist/{id}:
 *   get:
 *     summary: Get services by specialist ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of services by specialist ID
 */
router.route("/specialist/:id").get(getServicesBySpecialist);

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *   post:
 *     summary: Create or update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created or updated
 */
router.route("/").get(getServices).post(requireAuth(), createorUpdateService);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *   patch:
 *     summary: Update a service
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router
  .route("/:id")
  .get(getService)
  .patch(validateData(updatedServiceSchema), updateService)
  .delete(deleteService);

export default router;
