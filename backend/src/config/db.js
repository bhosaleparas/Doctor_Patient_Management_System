import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { config } from 'dotenv';


config(); 


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });



const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};



const disconnectDb = async () => {
  await prisma.$disconnect();
};


export { prisma, connectDb, disconnectDb };