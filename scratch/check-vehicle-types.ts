import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const types = await prisma.vehicleType.findMany();
  console.log('Available Vehicle Types:', JSON.stringify(types, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
