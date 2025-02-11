import * as mongoose from "mongoose";
import { categories } from "../constants/categories";

const specialistSchema = new mongoose.Schema({
  prefix: String,
  brief_description: { type: String, required: true },
  links: [{ type: String }],
  photo_link: String,
  description: String,
  budget_range: [{ type: Number }],
  schedule: { type: String },
  location: { type: String },
  languages: [{ type: String, required: true }],
  speciality: [{ type: String, required: true }],
  subspecialities: [{ type: String }],
  specialist_id: [{ type: String, required: true }],
  experience: { type: Number },
  rating: { type: Number },
  reviews: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  is_active: { type: Boolean, default: true },
  is_verified: { type: Boolean, default: false },
  category: { type: String, enum: categories, required: true },
});

export type Specialist = mongoose.InferSchemaType<typeof specialistSchema>;
export const SpecialistModel = mongoose.model<Specialist>(
  "Specialist",
  specialistSchema
);
