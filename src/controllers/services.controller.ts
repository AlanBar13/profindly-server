import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ServicesModel } from "../models/services.model";

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const service = new ServicesModel(req.body);
    await service.save();
    res.json(service);
  }
);

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await ServicesModel.find();
  res.json(services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServicesModel.findById(req.params.id);
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
      service.specialist_id = req.body.specialist_id || service.specialist_id;
      service.label = req.body.label || service.label;
      service.thumbnail = req.body.thumbnail || service.thumbnail;
      service.aviability = req.body.aviability || service.aviability;

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
      res.json({ message: "Service removed" });
    } else {
      res.status(404);
      throw new Error("Service not found");
    }
  }
);

export const getServicesBySpecialist = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServicesModel.findOne({ specialist_id: req.params.id });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  
  res.json(service._id);
});
