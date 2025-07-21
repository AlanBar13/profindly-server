import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { s3Service } from "../services/s3";
import emailService from "../services/email.service";
import { getAuth, clerkClient } from "@clerk/express";
import { prisma } from "../config/prisma";

export const createSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await prisma.user.findFirst({
      where: { authId: userId ?? undefined },
    });

    if (!user) {
      throw new Error(`User not found`);
    }

    const exist = await prisma.specialist.findFirst({
      where: { userId: user.id },
    });

    if (exist) {
      res.status(400);
      throw new Error(`User already has a Specialist Profile`);
    }

    // Remove speciality and subspecialities from req.body for specialist creation
    const { speciality, subspecialities, ...specialistData } = req.body;

    const specialist = await prisma.specialist.create({
      data: {
        ...specialistData,
        userId: user.id,
      },
    });

    // Handle specialities
    if (Array.isArray(speciality)) {
      for (const name of speciality) {
        let spec = await prisma.speciality.findUnique({ where: { name } });
        if (!spec) {
          spec = await prisma.speciality.create({ data: { name } });
        }
        await prisma.specialistSpeciality.create({
          data: {
            specialistId: specialist.id,
            specialityId: spec.id,
          },
        });
      }
    }
    // Handle subspecialities
    if (Array.isArray(subspecialities)) {
      for (const name of subspecialities) {
        let subspec = await prisma.subspeciality.findUnique({ where: { name } });
        if (!subspec) {
          subspec = await prisma.subspeciality.create({ data: { name } });
        }
        await prisma.specialistSubspeciality.create({
          data: {
            specialistId: specialist.id,
            subspecialityId: subspec.id,
          },
        });
      }
    }

    await clerkClient.users.updateUserMetadata(userId!, {
      publicMetadata: {
        specialist_form_filled: true,
      },
    });
    await emailService.sendSpecialistWelcomeMessage(
      user.email,
      `${user.name} ${user.lastname}`,
      specialist.prefix ?? ""
    );
    res.json(specialist);
  }
);

// TODO: Add cache to this endpoint
export const autoComplete = asyncHandler(
  async (req: Request, res: Response) => {
    const { query, field } = req.query;
    if (!query) {
      res.status(404);
      throw new Error("Query is required");
    }
    const searchField = (field as string) || "speciality";
    let results: string[] = [];
    if (searchField === "speciality") {
      const specialities = await prisma.speciality.findMany({
        where: {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        select: { name: true },
        take: 5,
      });
      results = specialities.map(s => s.name);
    } else if (searchField === "subspecialities") {
      const subspecialities = await prisma.subspeciality.findMany({
        where: {
          name: {
            contains: query as string,
            mode: "insensitive",
          },
        },
        select: { name: true },
        take: 5,
      });
      results = subspecialities.map(s => s.name);
    }
    res.json(results.slice(0, 3));
  }
);

// TODO: Add cache to this endpoint
export const getSpecialists = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, speciality, location, years } = req.query;
    const where: any = {};
    if (category) where.category = decodeURIComponent(category as string);
    if (location) where.location = decodeURIComponent(location as string);
    if (years) where.experience = { gte: parseInt(decodeURIComponent(years as string)) };
    where.isVerified = true;

    let specialistIds: number[] | undefined = undefined;
    if (speciality) {
      const spec = await prisma.speciality.findUnique({ where: { name: decodeURIComponent(speciality as string) } });
      if (spec) {
        const links = await prisma.specialistSpeciality.findMany({ where: { specialityId: spec.id } });
        specialistIds = links.map(l => l.specialistId);
      } else {
        specialistIds = [];
      }
    }
    if (specialistIds) {
      where.id = { in: specialistIds };
    }

    const specialists = await prisma.specialist.findMany({
      where,
      select: {
        id: true,
        prefix: true,
        briefDescription: true,
        photoLink: true,
        budgetRange: true,
        location: true,
        rating: true,
        user: {
          select: {
            name: true,
            lastname: true,
          },
        },
        specialities: {
          include: { speciality: true },
        },
        subspecialities: {
          include: { subspeciality: true },
        },
      },
      orderBy: {
        rating: { sort: "desc", nulls: "last" },
      },
    });
    res.json(specialists);
  }
);

export const getAllSpecialists = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const specialists = await prisma.specialist.findMany({
      include: {
        user: true,
      },
      skip,
      take: limit,
    });

    res.json(specialists);
  }
);

export const getSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const specialist = await prisma.specialist.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        services: { select: { id: true } },
      },
    });

    if (specialist) {
      res.json(specialist);
    } else {
      res.status(404);
      throw new Error("Specialist not found");
    }
  }
);

export const updateSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const { speciality, subspecialities, ...updateData } = req.body;
    const specialistId = parseInt(req.params.id);
    const updatedSpecialist = await prisma.specialist.update({
      where: { id: specialistId },
      data: {
        ...updateData,
      },
    });
    // Update specialities
    if (Array.isArray(speciality)) {
      // Remove old links
      await prisma.specialistSpeciality.deleteMany({ where: { specialistId } });
      for (const name of speciality) {
        let spec = await prisma.speciality.findUnique({ where: { name } });
        if (!spec) {
          spec = await prisma.speciality.create({ data: { name } });
        }
        await prisma.specialistSpeciality.create({
          data: {
            specialistId,
            specialityId: spec.id,
          },
        });
      }
    }
    // Update subspecialities
    if (Array.isArray(subspecialities)) {
      await prisma.specialistSubspeciality.deleteMany({ where: { specialistId } });
      for (const name of subspecialities) {
        let subspec = await prisma.subspeciality.findUnique({ where: { name } });
        if (!subspec) {
          subspec = await prisma.subspeciality.create({ data: { name } });
        }
        await prisma.specialistSubspeciality.create({
          data: {
            specialistId,
            subspecialityId: subspec.id,
          },
        });
      }
    }
    res.json(updatedSpecialist);
  }
);

export const deleteSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await prisma.specialist.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json({ message: "Specialist removed" });
    } catch (error) {
      res.status(404);
      throw new Error("Specialist not found");
    }
  }
);

export const uploadSpecialistPhoto = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const isPublic = req.body.isPublic as boolean;

    const response = await s3Service.uploadFile(file, isPublic);

    res.json(response);
  }
);
