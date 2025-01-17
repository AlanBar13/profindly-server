import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { BookingsModel } from "../models/bookings.model";
import { ServicesModel } from "../models/services.model";
import { getTimeSlots } from "../services/bookings.service";

interface Timings {
  day: string;
  opening_hour: string;
  opening_minute: string;
  opening_AM_or_PM: string;
  closing_hour: string;
  closing_minute: string;
  closing_AM_or_PM: string;
}

interface Aviability {
  timezone: string;
  duration: number;
  breakBefore: number;
  breakAfter: number;
  max_atendees?: number;
  timings: Timings[];
}

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = new BookingsModel(req.body);
    await booking.save();
    res.json(booking);
  }
);

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await BookingsModel.find();
  res.json(bookings);
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingsModel.findById(req.params.id);
  if (booking) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

export const updateBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingsModel.findById(req.params.id);
    if (booking) {
      booking.status = req.body.status || booking.status;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

export const deleteBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingsModel.deleteOne({ _id: req.params.id });
    if (booking.deletedCount > 0) {
      res.json({ message: "Booking removed" });
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.query.serviceId;
    console.log(serviceId)
    const service = await ServicesModel.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    const aviabilityData = service.aviability as Aviability;
    const slotsByDay = aviabilityData.timings.map((timing) => {
        return {
            day: timing.day,
            slots: getTimeSlots(
                `${timing.opening_hour}:${timing.opening_minute} ${timing.opening_AM_or_PM}`,
                `${timing.closing_hour}:${timing.closing_minute} ${timing.closing_AM_or_PM}`,
                aviabilityData.duration,
                aviabilityData.breakBefore,
                aviabilityData.breakAfter
              )
        }
    }
    );

    res.json(slotsByDay);
  }
);

export const getCurrentBookings = asyncHandler(
    async (req: Request, res: Response) => {
      const { serviceId, date } = req.query;
      console.log(serviceId, date)
      const bookings = await BookingsModel.find({
        service_id: serviceId,
        bookDate: date
      });

      res.json(bookings);
    }
);
