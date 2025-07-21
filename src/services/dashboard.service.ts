import dayjs from "dayjs";
import { prisma } from "../config/prisma";
import type { DashboardData } from "../types/DashboardData";

class DashboardService {
  async getDashboardData() {
    try {
      const users = await prisma.user.count();
      const specialists = await prisma.specialist.count({
        where: { isVerified: true },
      });
      const appoinments = await prisma.booking.count();
      const services = await prisma.service.count();
      const newClients = await prisma.user.count({
        where: {
          createdAt: {
            gte: dayjs().subtract(30, "day").toDate(),
          },
        },
      });
      const newSpecialists = await prisma.specialist.count({
        where: { isVerified: false },
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
      const pendingSpecialists = await prisma.specialist.findMany({
        where: { isVerified: false },
        include: { user: true },
      });
      return pendingSpecialists;
    } catch (error) {
      throw new Error("Error fetching pending specialists count");
    }
  }

  async getUsersCreatedLast90Days() {
    try {
      const startDate = dayjs().subtract(90, "day").toDate();
      const users = await prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      });

      const usersCountMap: Record<string, number> = {};
      users.forEach((user) => {
        const date = user.createdAt.toISOString().split("T")[0];
        usersCountMap[date] = (usersCountMap[date] || 0) + 1;
      });

      const usersCount = Object.entries(usersCountMap).map(([date, count]) => ({
        date,
        count,
      }));

      usersCount.sort((a, b) => (a.date > b.date ? 1 : -1));

      return usersCount;
    } catch (error) {
      throw new Error("Error fetching users created in the last 90 days");
    }
  }
}

export const dashboardService = new DashboardService();
