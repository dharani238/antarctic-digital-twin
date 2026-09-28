import prisma from "./prisma";

async function testDatabase() {
  try {
    await prisma.$connect();

    console.log("✅ PostgreSQL + Prisma connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();