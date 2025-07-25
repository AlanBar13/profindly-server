import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getAuth, clerkClient } from "@clerk/express";
import { prisma } from "../config/prisma";
import NotificationService from '../services/notifications.service'

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const exist = await prisma.user.findFirst({
    where: {
      OR: [{ email: req.body.email }, { authId: req.body.authId }],
    },
  });

  if (exist) {
    res.status(403);
    throw new Error("User already exist");
  }

  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new Error("Not Authenticated, failed to retreive id");
    }

    const user = await prisma.user.findFirst({
      where: {
        authId: userId,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const updatedUser = await prisma.user.update({
    where: {
      authId: req.params.id,
    },
    data: {
      name: req.body.name || undefined,
      lastname: req.body.lastname || undefined,
      email: req.body.email || undefined,
      gender: req.body.gender || undefined,
      preferredLanguage: req.body.preferred_language || undefined,
      preferredLocation: req.body.preferred_location || undefined,
      notificationToken: req.body.notificationToken || undefined,
      role: req.body.role || undefined,
      loginType: req.body.loginType || undefined,
      authId: req.body.authId || undefined,
    },
  });
  res.json(updatedUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: {
      authId: req.params.id,
    },
  });
  await clerkClient.users.deleteUser(req.params.id)
  res.json({ message: "User removed" });
});

export const upgradeUserToSpecialist = asyncHandler(
  async (req: Request, res: Response) => {
    const { auth_id, specialist_id } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        authId: auth_id,
      },
      include: {
        specialist: true,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.specialist) {
      res.status(404);
      throw new Error("Specialist not found");
    }

    // Check if user is already a specialist
    if (user.role === "SPECIALIST" && user.specialist.isVerified) {
      res.status(400);
      throw new Error("User is already a specialist");
    }

    // Update user and specialist in a single transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          role: "SPECIALIST",
        },
      }),
      prisma.specialist.update({
        where: { id: user.specialist.id },
        data: {
          isVerified: true,
        },
      }),
    ]);

    await clerkClient.users.updateUserMetadata(auth_id, {
      publicMetadata: {
        specialist: true,
      },
    });

    if (user.notificationToken) {
      await NotificationService.sendNotification(user.notificationToken, "Tu cuenta ha sido actualizada", "Ahora eres un especialista verificado", user.id, "INFO");
    }

    res.json({ message: "User upgraded to specialist sucessfully" });
  }
);
