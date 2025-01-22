import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SpecialistModel } from "../models/specialist.model";

export const createSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = new SpecialistModel(req.body);
    await specialist.save();
    res.json(specialist);
  }
);

export const getSpecialists = asyncHandler(
  async (req: Request, res: Response) => {
    const specialists = await SpecialistModel.find({}).sort({ rating: -1 }).populate("user");
    res.json(specialists);
  }
);

export const getSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = await SpecialistModel.findById(req.params.id).populate("user");
    if (specialist) {
      res.json(specialist);
    } else {
      res.status(404);
      throw new Error("Specialist not found");
    }
  }
);

export const updateSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = await SpecialistModel.findById(req.params.id);
    if (specialist) {
      specialist.prefix = req.body.prefix || specialist.prefix;
      specialist.brief_description = req.body.brief_description || specialist.brief_description;
      specialist.links = req.body.links || specialist.links;
      specialist.budget_range =
        req.body.budget_range || specialist.budget_range;
      specialist.schedule = req.body.schedule || specialist.schedule;
      specialist.location = req.body.location || specialist.location;
      specialist.languages = req.body.languages || specialist.languages;
      specialist.speciality = req.body.speciality || specialist.speciality;
      specialist.subspecialities =
        req.body.subspecialities || specialist.subspecialities;
      specialist.specialist_id =
        req.body.specialist_id || specialist.specialist_id;
      specialist.experience = req.body.experience || specialist.experience;
      specialist.rating = req.body.rating || specialist.rating;
      specialist.reviews = req.body.reviews || specialist.reviews;
      specialist.user = req.body.user || specialist.user;

      const updatedSpecialist = await specialist.save();
      res.json(updatedSpecialist);
    } else {
      res.status(404);
      throw new Error("Specialist not found");
    }
  }
);

export const deleteSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = await SpecialistModel.deleteOne({ _id: req.params.id });
    if (specialist.deletedCount > 0) {
      res.json({ message: "Specialist removed" });
    } else {
      res.status(404);
      throw new Error("Specialist not found");
    }
  }
);
