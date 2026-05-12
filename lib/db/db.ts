// lib/db/db.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import config from "./config";

const client = createClient({
  // لوکال کار می‌کنه، بعداً می‌تونی URL تورسو رو بدی
  url: config.DATABASE_URL,
});

export const db = drizzle(client, { schema });
