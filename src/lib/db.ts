import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
function getDatabaseUrl(): string {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL_LOCAL

  if (!databaseUrl) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL (or POSTGRES_URL_NON_POOLING/POSTGRES_PRISMA_URL/POSTGRES_URL/DATABASE_URL_LOCAL).",
    )
  }

  return databaseUrl
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
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
