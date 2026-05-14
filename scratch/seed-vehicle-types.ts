import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const types = ['Truck', 'Van', 'Pickup', 'Bike'];
  
  for (const type of types) {
    await prisma.vehicleType.upsert({
      where: { name: type },
      update: {},
      create: { name: type, description: `${type} vehicle category` }
    });
  }
  
  console.log('Successfully seeded vehicle types:', types.join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
