import { specialists } from "./SpecialistTestData";
import { users } from "./UserTestData";
import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client"

export const seed = async () => {
  try {
    console.log("Deleting existing data...");
    await prisma.booking.deleteMany()
    await prisma.service.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.specialist.deleteMany()
    await prisma.user.deleteMany()
    console.log("Existing data deleted");
    console.log("Seeding new data...");
    const allPromises = users.map(async (u, i) => {
      let user: Prisma.UserCreateInput = {
        name: u.name,
        lastname: u.lastname,
        gender: u.gender,
        email: u.email,
        role: "SPECIALIST",
        loginType: u.login_type,
        authId: u.auth_id,
        specialist: {
          create: {
            prefix: specialists[i].prefix,
            briefDescription: specialists[i].brief_description,
            description: specialists[i].description,
            links: specialists[i].links,
            photoLink: specialists[i].photo_link,
            budgetRange: specialists[i].budget_range,
            schedule: specialists[i].schedule,
            location: specialists[i].location,
            languages: specialists[i].languages,
            specialistId: specialists[i].specialist_id,
            experience: specialists[i].experience,
            rating: specialists[i].rating,
            reviews: specialists[i].reviews,
            category: specialists[i].category,
            isActive: specialists[i].is_active,
            isVerified: specialists[i].is_verified
          }
        }
      }

      // Create the user and specialist
      const createdUser = await prisma.user.create({ data: user, include: { specialist: true } });
      const specialist = createdUser.specialist;

      if (specialist) {
        // Handle specialities
        if (Array.isArray(specialists[i].speciality)) {
          for (const name of specialists[i].speciality) {
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
        if (Array.isArray(specialists[i].subspecialities)) {
          for (const name of specialists[i].subspecialities) {
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
      }
    });

    await Promise.all(allPromises)
    
    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
