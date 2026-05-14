import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";

// When prisma.config.ts is present, Prisma stops auto-loading .env
loadEnv({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  experimental: {
    adapter: true,
  },
  adapter: () => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    return Promise.resolve(adapter);
  },
});
