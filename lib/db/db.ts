// lib/db/db.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  // لوکال کار می‌کنه، بعداً می‌تونی URL تورسو رو بدی
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

export const db = drizzle(client, { schema });
