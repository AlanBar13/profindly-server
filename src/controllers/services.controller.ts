import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ServicesModel } from "../models/services.model";
import { getAuth } from "@clerk/express";
import { UserModel } from "../models/user.model";
import { SpecialistModel } from "../models/specialist.model";
import { BookingsModel } from "../models/bookings.model";

export const createorUpdateService = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await UserModel.findOne({ auth_id: userId });
    if (!user) {
      throw new Error(`User not found`);
    }

    const specialist = await SpecialistModel.findOne({ user: user._id });
    if (!specialist) {
      res.status(400);
      throw new Error(`User is not a Specialist`);
    }

    const serviceFound = await ServicesModel.findOne({
      specialist: specialist._id,
    });
    if (serviceFound) {
      serviceFound.specialist = req.body.specialist || serviceFound.specialist;
      serviceFound.label = req.body.label || serviceFound.label;
      serviceFound.thumbnail = req.body.thumbnail || serviceFound.thumbnail;
      serviceFound.aviability = req.body.aviability || serviceFound.aviability;
      serviceFound.location = req.body.location || serviceFound.location;

      const updatedService = await serviceFound.save();
      res.json(updatedService);
    } else {
      const service = new ServicesModel(req.body);
      service.specialist = specialist._id;
      await service.save();

      // Add service to specialist
      specialist.service = service._id;
      await specialist.save()
      res.json(service);
    }
  }
);

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await ServicesModel.find().lean();
  res.json(services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServicesModel.findById(req.params.id).lean();
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const service = await ServicesModel.findById(req.params.id);
    if (service) {
      service.specialist = req.body.specialist || service.specialist;
      service.label = req.body.label || service.label;
      service.thumbnail = req.body.thumbnail || service.thumbnail;
      service.aviability = req.body.aviability || service.aviability;
      service.location = req.body.location || service.location;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404);
      throw new Error("Service not found");
    }
  }
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const service = await ServicesModel.deleteOne({ _id: req.params.id });
    if (service.deletedCount > 0) {
      await BookingsModel.deleteMany({ service: req.params.id });
      res.json({ message: "Service removed" });
    } else {
      res.status(404);
      throw new Error("Service not found");
    }
  }
);

export const getServicesBySpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const service = await ServicesModel.findOne({
      specialist: req.params.id,
    }).lean();
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json(service._id);
  }
);

export const getSpecialistService = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await UserModel.findOne({ auth_id: userId }).lean();
    if (!user) {
      throw new Error(`User not found`);
    }

    const specialist = await SpecialistModel.findOne({ user: user._id }).lean();
    if (!specialist) {
      res.status(400);
      throw new Error(`User is not a Specialist`);
    }

    const service = await ServicesModel.findOne({
      specialist: specialist._id,
    }).lean();
    if (!service) {
      res.json(null);
    }

    res.json(service);
  }
);
