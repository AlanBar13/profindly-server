import dayjs from "dayjs";
import { BookingsModel } from "../models/bookings.model";
import { ServicesModel } from "../models/services.model";
import { SpecialistModel } from "../models/specialist.model";
import { UserModel } from "../models/user.model";
import type { DashboardData } from "../types/DashboardData";

class DashboardService {
  async getDashboardData() {
    try {
      const users = await UserModel.countDocuments({});
      const specialists = await SpecialistModel.countDocuments({
        is_verified: true,
      });
      const appoinments = await BookingsModel.countDocuments({});
      const services = await ServicesModel.countDocuments({});
      const newClients = await UserModel.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      });
      const newSpecialists = await SpecialistModel.countDocuments({
        is_verified: false,
      });

      const data: DashboardData = {
        users: users,
        bookings: appoinments,
        specialists: specialists,
        services: services,
        totalBookings: appoinments,
        newClients: newClients,
        pendingSpecialists: newSpecialists,
      };

      return data;
    } catch (error) {
      throw new Error("Error fetching dashboard data");
    }
  }

  async getPendingSpecialists() {
    try {
      const pendingSpecialists = await SpecialistModel.find({
        is_verified: false,
      })
        .populate("user")
        .lean();
      return pendingSpecialists;
    } catch (error) {
      throw new Error("Error fetching pending specialists count");
    }
  }

  async getUsersCreatedLast90Days() {
    try {
      // Use a more efficient query to reduce aggregation overhead
      const startDate = dayjs().subtract(90, "day").toDate();
      const users = await UserModel.find(
        { createdAt: { $gte: startDate } },
        { createdAt: 1 } // Only fetch the createdAt field
      ).lean();

      // Process the data in memory to group by date
      const usersCountMap: Record<string, number> = {};
      users.forEach((user) => {
        const date = user.createdAt.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
        usersCountMap[date] = (usersCountMap[date] || 0) + 1;
      });

      // Convert the map to an array of { date, count } objects
      const usersCount = Object.entries(usersCountMap).map(([date, count]) => ({
        date,
        count,
      }));

      // Sort the result by date
      usersCount.sort((a, b) => (a.date > b.date ? 1 : -1));

      return usersCount;
    } catch (error) {
      throw new Error("Error fetching users created in the last 90 days");
    }
  }
}

export const dashboardService = new DashboardService();
