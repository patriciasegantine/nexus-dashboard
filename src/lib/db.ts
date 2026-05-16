import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}
export const db: PrismaClient = globalThis.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}
