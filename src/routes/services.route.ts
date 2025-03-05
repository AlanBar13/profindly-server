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

router.route("/specialist").get(requireAuth(), getSpecialistService);
router.route("/specialist/:id").get(getServicesBySpecialist);
router.route("/").get(getServices).post(requireAuth(), createorUpdateService);
router
  .route("/:id")
  .get(getService)
  .patch(validateData(updatedServiceSchema), updateService)
  .delete(deleteService);

export default router;
