import express from "express";
import { validateData } from "../middleware/validation.middleware";
import {
  servicesSchema,
  updatedServiceSchema,
} from "../schema/services.schema";
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} from "../controllers/services.controller";

const router = express.Router();

router
  .route("/")
  .get(getServices)
  .post(validateData(servicesSchema), createService);
router
  .route("/:id")
  .get(getService)
  .patch(validateData(updatedServiceSchema), updateService)
  .delete(deleteService);

export default router;
