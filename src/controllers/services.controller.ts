import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prisma";
import { getAuth } from "@clerk/express";

export const createorUpdateService = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
    if (!user) {
      throw new Error(`User not found`);
    }

    const specialist = await prisma.specialist.findFirst({ where: { userId: user.id } });
    if (!specialist) {
      res.status(400);
      throw new Error(`User is not a Specialist`);
    }

    const serviceFound = await prisma.service.findFirst({ where: { specialistId: specialist.id } });
    if (serviceFound) {
      const updatedService = await prisma.service.update({
        where: { id: serviceFound.id },
        data: {
          specialistId: req.body.specialistId || serviceFound.specialistId,
          label: req.body.label || serviceFound.label,
          thumbnail: req.body.thumbnail || serviceFound.thumbnail,
          aviability: req.body.aviability || serviceFound.aviability,
          location: req.body.location || serviceFound.location,
        },
      });
      res.json(updatedService);
    } else {
      const service = await prisma.service.create({
        data: {
          ...req.body,
          specialistId: specialist.id,
        },
      });
      res.json(service);
    }
  }
);

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await prisma.service.findMany();
  res.json(services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const service = await prisma.service.findUnique({ where: { id } });
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const updatedService = await prisma.service.update({
        where: { id },
        data: {
          specialistId: req.body.specialistId,
          label: req.body.label,
          thumbnail: req.body.thumbnail,
          aviability: req.body.aviability,
          location: req.body.location,
        },
      });
      res.json(updatedService);
    } catch (error) {
      res.status(404);
      throw new Error("Service not found");
    }
  }
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.booking.deleteMany({ where: { serviceId: id } });
      await prisma.service.delete({ where: { id } });
      res.json({ message: "Service removed" });
    } catch (error) {
      res.status(404);
      throw new Error("Service not found");
    }
  }
);

export const getServicesBySpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialistId = parseInt(req.params.id);
    const service = await prisma.service.findFirst({ where: { specialistId } });
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }
    res.json(service.id);
  }
);

export const getSpecialistService = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
    if (!user) {
      throw new Error(`User not found`);
    }
    const specialist = await prisma.specialist.findFirst({ where: { userId: user.id } });
    if (!specialist) {
      res.status(400);
      throw new Error(`User is not a Specialist`);
    }
    const service = await prisma.service.findFirst({ where: { specialistId: specialist.id } });
    if (!service) {
      res.json(null);
    }
    res.json(service);
  }
);
