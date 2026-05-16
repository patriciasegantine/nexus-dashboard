import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(__dirname, ".env") });

// In Prisma 7, prisma.config.ts only handles CLI config (schema path, migrations URL).
// The adapter (PrismaPg) is passed directly to the PrismaClient constructor in src/lib/db.ts.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
