import { PrismaClient } from '@prisma/client'

// Standard Next.js dev singleton — without it, hot reload spins up a fresh
// PrismaClient (and connection pool) on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
