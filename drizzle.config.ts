import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Please add it to your .env file. Example for Neon:\n' +
      'DATABASE_URL=postgresql://user:password@ep-...neon.tech/db?sslmode=require'
  );
}

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
} satisfies Config;
