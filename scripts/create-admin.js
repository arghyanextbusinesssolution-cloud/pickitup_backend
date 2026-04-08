const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@uship.com';
  const password = process.argv[3] || 'Admin@123';
  const firstName = 'System';
  const lastName = 'Admin';

  console.log(`🚀 Creating admin user: ${email}...`);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  User already exists. Updating to ADMIN role...');
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
      console.log('✅ User updated successfully.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: 'ADMIN',
        isVerified: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
    console.log('Please change this password after your first login.');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
