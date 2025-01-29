import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SpecialistModel, type Specialist } from "../models/specialist.model";
import type { Filter } from "../types/Filter";

export const createSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = new SpecialistModel(req.body);
    await specialist.save();
    res.json(specialist);
  }
);

// TODO: Add cache to this endpoint
export const autoComplete = asyncHandler(
  async (req: Request, res: Response) => {
    const { query, field } = req.query;
    if (!query) {
      res.status(404);
      throw new Error("Query is required");
    }

    const regex = new RegExp(query as string, "i");
    const searchField = (field as string) || "speciality";

    const results = await SpecialistModel.find({
      [searchField]: { $regex: regex },
    })
      .select(searchField)
      .limit(5);

    const uniqueFields = [
      ...new Set(
        results.flatMap((result) => result[searchField as keyof Specialist])
      ),
    ];

    res.json(uniqueFields.slice(0, 3));
  }
);

// TODO: Add cache to this endpoint
export const getSpecialists = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, speciality, location, years } = req.query;

    // Narrow down the search by category, speciality, location, and years
    const filter: Filter = {};
    if (category !== undefined) {
      filter.category = decodeURIComponent(category as string);
    }

    if (speciality !== undefined) {
      filter.speciality = decodeURIComponent(speciality as string);
    }

    if (location !== undefined) {
      filter.location = decodeURIComponent(location as string);
    }

    if (years !== undefined) {
      filter.years = decodeURIComponent(years as string);
    }

    if (Object.keys(filter).length > 0) {
      console.log("filter", filter);
      // narrow down the search by filter
      const specialists = await SpecialistModel.find(filter)
        .sort({ rating: -1 })
        .populate("user");
      
      res.json(specialists);
    } else {
      const specialists = await SpecialistModel.find({})
        .sort({ rating: -1 })
        .populate("user");
      res.json(specialists);
    }
  }
);

export const getSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = await SpecialistModel.findById(req.params.id).populate(
      "user"
    );
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
      specialist.brief_description =
        req.body.brief_description || specialist.brief_description;
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
