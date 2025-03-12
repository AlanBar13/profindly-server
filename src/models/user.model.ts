import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  preferred_language: String,
  preferred_location: String,
  email: { type: String, required: true },
  notificationToken: String,
  role: {
    type: String,
    enum: ["user", "patient", "specialist"],
    default: "user",
  },
  login_type: { type: String, required: true },
  auth_id: { type: String, required: true },
});

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model<User>("User", userSchema);
