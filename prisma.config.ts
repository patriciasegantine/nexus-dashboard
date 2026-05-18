import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(__dirname, ".env") });

function getDatabaseUrl(): string {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL_LOCAL;

  if (!databaseUrl) {
    throw new Error(
      "Missing database URL. Set DATABASE_URL (or POSTGRES_URL_NON_POOLING/POSTGRES_PRISMA_URL/POSTGRES_URL/DATABASE_URL_LOCAL).",
    );
  }

  return databaseUrl;
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: getDatabaseUrl(),
  },
});
