import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";
import { DISTRICTS } from "../lib/bangladesh-locations";

const prisma = new PrismaClient();

const SEED_DOMAIN = "@seed.dropway";
const RIDERS_PER_UPAZILA = 2;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const users = [];
  const riders = [];

  let counter = 10000000;

  for (const district of DISTRICTS) {
    for (const upazila of district.upazilas) {
      for (let i = 1; i <= RIDERS_PER_UPAZILA; i += 1) {
        counter += 1;

        const userId = crypto.randomUUID();
        const name = `${upazila} Rider ${i}`;

        users.push({
          id: userId,
          name,
          email: `rider.${slugify(district.name)}-${slugify(upazila)}-${i}${SEED_DOMAIN}`,
          emailVerified: true,
          role: "rider",
        });

        riders.push({
          id: crypto.randomUUID(),
          userId,
          name,
          phoneNumber: `017${String(counter).padStart(8, "0")}`,
          location: `${upazila}, ${district.name}`,
          district: district.name,
          upazila,
          nid: String(2000000000 + counter),
          status: "active",
        });
      }
    }
  }

  // Make the script re-runnable: drop riders from a previous seed run.
  const oldUsers = await prisma.user.findMany({
    where: { email: { endsWith: SEED_DOMAIN } },
    select: { id: true },
  });

  if (oldUsers.length > 0) {
    const oldIds = oldUsers.map((user) => user.id);
    await prisma.rider.deleteMany({ where: { userId: { in: oldIds } } });
    await prisma.user.deleteMany({ where: { id: { in: oldIds } } });
    console.log(`Removed ${oldUsers.length} riders from a previous seed run.`);
  }

  const before = await prisma.rider.count();

  await prisma.user.createMany({ data: users });
  await prisma.rider.createMany({ data: riders });

  const after = await prisma.rider.count();
  const upazilaCount = DISTRICTS.reduce(
    (total, district) => total + district.upazilas.length,
    0,
  );

  console.log(`Districts: ${DISTRICTS.length}`);
  console.log(`Upazilas: ${upazilaCount}`);
  console.log(
    `Riders before: ${before} | created: ${riders.length} | total now: ${after}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
