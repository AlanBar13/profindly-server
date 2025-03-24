import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import { getAuth } from "@clerk/express";
import { BookingsModel } from "../models/bookings.model";
import { ServicesModel } from "../models/services.model";
import { getTimeSlots, parseTime } from "../services/bookings.service";
import { UserModel } from "../models/user.model";
import notificationsService from "../services/notifications.service";

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
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await UserModel.findOne({ auth_id: userId }).lean();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const booking = new BookingsModel(req.body);
    booking.client = user._id;
    await booking.save();

    await notificationsService.sendNotificationByService(
      req.body.service,
      "Se Agendo una nueva cita",
      `${req.body.bookDate} ${req.body.startTime} - ${req.body.startTime} Revisa las notificaiones para mas detalle`,
      user._id.toString(),
      "info",
      booking._id.toString(),
    );
    res.json(booking);
  }
);

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await BookingsModel.find().lean();
  res.json(bookings);
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await UserModel.findOne({ auth_id: userId }).lean();
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const today = dayjs();

  const booking = await BookingsModel.find({
    client: user._id,
    bookingStart: {
      $gte: today.startOf("day").toDate(),
      // $lte: today.endOf("week").toDate(),
    },
  })
    .populate({
      path: "service",
      select: "label location specialist",
      populate: {
        path: "specialist",
        select: "user prefix",
        populate: { path: "user", select: "name lastname" },
      },
    })
    .lean();
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
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await UserModel.findOne({ auth_id: userId });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const booking = await BookingsModel.findOne({ _id: req.params.id, client: user._id }).lean();
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const bookingDeleted = await BookingsModel.deleteOne({
      _id: req.params.id,
      client: user._id,
    });
    if (bookingDeleted.deletedCount > 0) {
      await notificationsService.sendNotificationByService(
        booking.service._id.toString(),
        "Se cancelo una cita",
        `${booking.bookDate} ${booking.startTime} - ${booking.endTime} Revisa las notificaiones para mas detalle`,
        user._id.toString(),
        "info",
        booking._id.toString()
      );
      res.json({ message: "Booking removed" });
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const serviceId = req.query.serviceId;

  const service = await ServicesModel.findById(serviceId).lean();
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
      ),
    };
  });

  res.json(slotsByDay);
});

export const getCurrentBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const { serviceId, date } = req.query;
    const bookings = await BookingsModel.find({
      service_id: serviceId,
      bookDate: date,
    }).lean();

    res.json(bookings);
  }
);

export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const { serviceId, date } = req.query;
    const day = dayjs(date as string).format("dddd");

    const service = await ServicesModel.findById(serviceId).lean();
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    // Check if the service is available for the day
    const aviabilityData = service.aviability as Aviability;
    const timing = aviabilityData.timings.find((timing) => timing.day === day);
    if (!timing) {
      res.json([]);
      return;
    }

    // Get the slots for the day
    const slots = getTimeSlots(
      `${timing.opening_hour}:${timing.opening_minute} ${timing.opening_AM_or_PM}`,
      `${timing.closing_hour}:${timing.closing_minute} ${timing.closing_AM_or_PM}`,
      aviabilityData.duration,
      aviabilityData.breakBefore,
      aviabilityData.breakAfter
    );

    // Get the booked slots for the day
    const bookedSlots = await BookingsModel.find({
      service_id: serviceId,
      bookDate: date,
    }).lean();

    let availableTimeSlots = slots;
    // If the date is today, filter out the slots that have already passed
    if (dayjs(date as string).isSame(dayjs(), "day")) {
      const currentTime = dayjs().format("hh:mm A");

      availableTimeSlots = availableTimeSlots?.filter((slot) => {
        const currentTimeIn24 = parseTime(currentTime);
        const slotTime = parseTime(slot.start);
        return (
          currentTimeIn24.hours < slotTime.hours ||
          (currentTimeIn24.hours === slotTime.hours &&
            currentTimeIn24.minutes <= slotTime.minutes)
        );
      });
    }

    // If there are no booked slots, return all available slots
    if (bookedSlots.length === 0 && availableTimeSlots) {
      res.json(availableTimeSlots);
    } else {
      // If there are booked slots, filter out the slots that are already booked
      const availableSlots = availableTimeSlots?.filter((slot) => {
        return !bookedSlots.some(
          (bookedSlot) =>
            bookedSlot.startTime === slot.start &&
            bookedSlot.endTime === slot.end
        );
      });

      res.json(availableSlots ?? []);
    }
  }
);
