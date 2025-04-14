import { UserModel } from "../models/user.model";
import { SpecialistModel } from "../models/specialist.model";
import { ServicesModel } from "../models/services.model";
import { NotificationsModel } from "../models/notifications.models";
import { BookingsModel } from "../models/bookings.model";
import { specialists } from "./SpecialistTestData";
import { users } from "./UserTestData";
import mongoose from "mongoose";

export const seed = async () => {
  try {
    console.log("Deleting existing data...");
    await UserModel.deleteMany({});
    await SpecialistModel.deleteMany({});
    await ServicesModel.deleteMany({});
    await NotificationsModel.deleteMany({});
    await BookingsModel.deleteMany({});
    console.log("Existing data deleted");
    console.log("Seeding new data...");
    const addedUsers = await UserModel.create(users);
    for (let i = 0; i < specialists.length; i++) {
      specialists[i].user = addedUsers[i]._id;
    }
    await SpecialistModel.create(specialists);
    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/healthcare";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to database");
    return seed();
  })
  .catch((error) => console.error("Error connecting to database:", error))
  .finally(() => mongoose.disconnect());
