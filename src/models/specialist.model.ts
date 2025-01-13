import * as mongoose from "mongoose";

const specialistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
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
  //appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
});

export type Specialist = mongoose.InferSchemaType<typeof specialistSchema>;
export const SpecialistModel = mongoose.model<Specialist>(
  "Specialist",
  specialistSchema
);
