import express from "express";
import { getDashboardData, getPendingSpecialistData, getUsersCreatedLast90Days } from "../controllers/dashboard.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for managing dashboard data
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.route("/").get(getDashboardData);

/**
 * @swagger
 * /api/v1/dashboard/pending-specialists:
 *   get:
 *     summary: Get specialists pending approval
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Pending specialists
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Specialist'
 */
router.route("/pending-specialists").get(getPendingSpecialistData);

/**
 * @swagger
 * /api/v1/dashboard/user-count:
 *   get:
 *     summary: Get user count created in the last 90 days
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: User count created in the last 90 days
 */
router.route("/user-count").get(getUsersCreatedLast90Days);

export default router;