import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations use the DIRECT (non-pooled) Neon connection.
// `?? ""` keeps `prisma generate` working on machines without a database (e.g. CI).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
