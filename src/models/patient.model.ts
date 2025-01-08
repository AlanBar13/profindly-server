import * as mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    syntoms: [{ type: String }],
    diagnostic: { type: String },
    treatment: { type: String },
    budget: [{ type: Number }],
    location: { type: String },
    languages: [{ type: String }],
});

export type Patient = mongoose.InferSchemaType<typeof patientSchema>;
export const PatientModel = mongoose.model<Patient>('Patient', patientSchema);