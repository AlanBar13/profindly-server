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
} from "../controllers/specialist.controller";
import { requireAuth } from "@clerk/express";
import upload from "../config/upload";

const router = express.Router();

router
  .route("/")
  .get(getSpecialists)
  .post(requireAuth(), validateData(specialistSchema), createSpecialist);
router.route("/autocomplete").get(autoComplete);
router.route("/photo").post(upload.single("photo"), uploadSpecialistPhoto);
router
  .route("/:id")
  .get(getSpecialist)
  .patch(validateData(updatedSpecialistSchema), updateSpecialist)
  .delete(deleteSpecialist);

export default router;
