import * as mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialist",
    required: true,
  },
  label: { type: String, required: true },
  thumbnail: String,
  location: String,
  aviability: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

servicesSchema.index({ location: 1, type: 1, price: 1 });

export type Services = mongoose.InferSchemaType<typeof servicesSchema>;
export const ServicesModel = mongoose.model<Services>(
  "Services",
  servicesSchema
);
