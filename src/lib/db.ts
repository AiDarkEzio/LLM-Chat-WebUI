import { PrismaClient } from '@prisma/client';

// Cast globalThis to an unknown type and then to an object with a prisma property
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Initialize a global instance of PrismaClient if it doesn't exist
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Store the PrismaClient instance globally in non-production environments
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export the PrismaClient instance as 'db'
export { prisma as db };
