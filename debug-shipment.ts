import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const shipment = await prisma.shipment.findFirst({
        where: { id: { endsWith: 'CMPVMAQ9' } } // Use endsWith just in case it's a suffix or prefix issue
    });
    console.log('Shipment Details:', JSON.stringify(shipment, null, 2));

    const allShipments = await prisma.shipment.findMany({
        select: { id: true, status: true, title: true, weightUnit: true }
    });
    console.log('All Shipments:', JSON.stringify(allShipments, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
