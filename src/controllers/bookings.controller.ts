import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import { getAuth } from "@clerk/express";
import { prisma } from "../config/prisma";
import { getTimeSlots, parseTime } from "../services/bookings.service";
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

    const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Calculate bookingStart and bookingEnd
    const date = dayjs(req.body.bookDate);
    const bookingStart = date
      .set("hour", parseInt(req.body.startTime.split(":")[0]))
      .set("minute", parseInt(req.body.startTime.split(":")[1]))
      .toDate();
    const bookingEnd = date
      .set("hour", parseInt(req.body.endTime.split(":")[0]))
      .set("minute", parseInt(req.body.endTime.split(":")[1]))
      .toDate();

    const serviceId = typeof req.body.service === "number" ? req.body.service : parseInt(req.body.service);
    const service = await prisma.service.findUnique({ where: { id: serviceId }, include: { specialist: true } });
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId: service.id,
        clientId: user.id,
        specialistId: service.specialistId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: req.body.status || undefined,
        bookDate: req.body.bookDate,
        bookingStart,
        bookingEnd,
      },
    });

    await notificationsService.sendNotificationByService(
      service.id.toString(),
      "Se Agendo una nueva cita",
      `${req.body.bookDate} ${req.body.startTime} - ${req.body.startTime} Revisa las notificaiones para mas detalles`,
      user.id.toString(),
      "action",
      booking.id.toString()
    );
    res.json(booking);
  }
);

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({ include: { service: true, client: true, specialist: true } });
  res.json(bookings);
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const today = dayjs();

  const bookings = await prisma.booking.findMany({
    where: {
      clientId: user.id,
      bookingStart: {
        gte: today.startOf("day").toDate(),
      },
      status: { notIn: ["CANCELLED", "COMPLETED"] },
    },
    include: {
      service: {
        include: {
          specialist: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  if (bookings) {
    res.json(bookings);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

export const getSpecialistBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const specialistId = parseInt(req.params.id);
    const specialist = await prisma.specialist.findUnique({ where: { id: specialistId } });
    if (!specialist) {
      res.status(404);
      throw new Error("Specialist not found");
    }

    const today = dayjs();

    const bookings = await prisma.booking.findMany({
      where: {
        specialistId: specialist.id,
        bookingStart: {
          gte: today.startOf("day").toDate(),
        },
        status: { notIn: ["CANCELLED", "COMPLETED"] },
      },
      include: {
        client: true,
        service: {
          include: {
            specialist: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    if (bookings) {
      res.json(bookings);
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

export const updateBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const id = parseInt(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (booking) {
      const now = dayjs();
      const start = dayjs(booking.bookingStart);
      if (booking.bookingStart && start < now) {
        res.status(400);
        throw new Error("Cannot update booking");
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
          status: req.body.status || booking.status,
        },
      });
      switch (req.body.status) {
        case "cancelled":
          await notificationsService.sendNotification(
            req.body.fromToken,
            "Se cancelo una cita",
            `El especialista cancelo la cita, ${booking.bookDate} ${booking.startTime} - ${booking.endTime}`,
            user.id.toString(),
            "info"
          );
          break;
        case "booked":
          await notificationsService.sendNotification(
            req.body.fromToken,
            "Tu cita fue confirmada",
            `Tu cita fue confirmada, ${booking.bookDate} ${booking.startTime} - ${booking.endTime}`,
            user.id.toString(),
            "info"
          );
          break;
        default:
          console.log("No notification sent");
          break;
      }
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

    const user = await prisma.user.findFirst({ where: { authId: userId ?? undefined } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const id = parseInt(req.params.id);
    const booking = await prisma.booking.findFirst({ where: { id, clientId: user.id } });
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    await prisma.booking.delete({ where: { id } });
    await notificationsService.sendNotificationByService(
      booking.serviceId.toString(),
      "Se cancelo una cita",
      `${booking.bookDate} ${booking.startTime} - ${booking.endTime} Revisa las notificaiones para mas detalle`,
      user.id.toString(),
      "info",
      booking.id.toString()
    );
    res.json({ message: "Booking removed" });
  }
);

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const serviceId = parseInt(req.query.serviceId as string);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  const aviabilityData = service.aviability as unknown as Aviability;
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
    const serviceId = parseInt(req.query.serviceId as string);
    const date = req.query.date as string;
    const bookings = await prisma.booking.findMany({
      where: {
        serviceId,
        bookDate: date,
      },
    });

    res.json(bookings);
  }
);

export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = parseInt(req.query.serviceId as string);
    const date = req.query.date as string;
    const day = dayjs(date).format("dddd");

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    // Check if the service is available for the day
    const aviabilityData = service.aviability as unknown as Aviability;
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
    const bookedSlots = await prisma.booking.findMany({
      where: {
        serviceId,
        bookDate: date,
      },
    });

    let availableTimeSlots = slots;
    // If the date is today, filter out the slots that have already passed
    if (dayjs(date).isSame(dayjs(), "day")) {
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
