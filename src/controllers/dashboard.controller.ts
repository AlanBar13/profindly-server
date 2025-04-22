import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { dashboardService } from "../services/dashboard.service";

export const getDashboardData = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  }
);

export const getPendingSpecialistData = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getPendingSpecialists();
    res.json(data);
  }
);

export const getUsersCreatedLast90Days = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getUsersCreatedLast90Days();
    res.json(data);
  }
);