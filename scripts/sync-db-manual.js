const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Synchronizing fields manually via SQL...');
    
    // Check if columns exist first
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Booking' AND table_schema = 'public'
    `;
    const colNames = columns.map(c => c.column_name);
    console.log('Existing columns:', colNames);

    const missingColumns = [
      { name: 'pickupPhotos', type: 'text[]' },
      { name: 'deliveryPhotos', type: 'text[]' },
      { name: 'hasInsurance', type: 'boolean', default: 'false' },
      { name: 'insuranceFee', type: 'decimal(12,2)', default: '0' },
      { name: 'isDamaged', type: 'boolean', default: 'false' },
      { name: 'damagePhotos', type: 'text[]' },
      { name: 'damageDescription', type: 'text' }
    ].filter(col => !colNames.includes(col.name));

    if (missingColumns.length === 0) {
      console.log('All insurance/verification columns already exist.');
    } else {
      for (const col of missingColumns) {
        console.log(`Adding column: ${col.name}...`);
        let sql = `ALTER TABLE "public"."Booking" ADD COLUMN "${col.name}" ${col.type}`;
        if (col.default !== undefined) {
          sql += ` DEFAULT ${col.default}`;
        }
        await prisma.$executeRawUnsafe(sql);
      }
      console.log('Successfully added missing columns.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
