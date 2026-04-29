import { defineConfig } from "@prisma/config";
import { loadEnvConfig } from '@next/env'

// Load Next.js environment variables (including .env.local)
loadEnvConfig(process.cwd())

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
