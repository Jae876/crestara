// Singleton Prisma Client - to avoid multiple instances causing memory leaks
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  var prismaInstance: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prismaInstance) {
    global.prismaInstance = new PrismaClient();
  }
  prisma = global.prismaInstance;
}

export default prisma;
