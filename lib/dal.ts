import { db } from '@/db';
import { getSession } from './auth';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { cacheTag } from 'next/cache';
import { issues, users } from '@/db/schema';
import { mockDelay } from './utils';



mockDelay(700);
// Current user
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  try {
    const result = await db.select().from(users).where(eq(users.id, session.userId));

    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
})

// Get user by email
export const getUserByEmail = async (email: string) => {
  if (!email) {
    return null;
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return result[0] || null;
  } catch (error: any) {
    console.error('Error getting user by email:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      detail: error?.detail,
      hint: error?.hint,
    });

    // Provide more specific error information
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      throw new Error('Database connection failed. Please check your DATABASE_URL.');
    }
    // PostgreSQL error code for "relation does not exist"
    if (
      error?.code === '42P01' ||
      error?.message?.includes('does not exist') ||
      error?.message?.includes('relation')
    ) {
      throw new Error('Database table "users" does not exist. Please run: npm run db:push');
    }
    // Re-throw with more context
    throw new Error(`Database query failed: ${error?.message || error?.toString()}`);
  }
};

export async function getIssues() {
  'use cache';
  cacheTag('issue');
  try {
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    });
    return result;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw new Error('Failed to fetch issues');
  }
}
export async function getIssue(id: number) { 
  'use cache';
  cacheTag('issue');
  try {
    const result = await db.query.issues.findFirst({
      where: eq(issues.id, id),
      with: {
        user: true,
        },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    });
    return result;
  } catch (error) {
    console.error('Error fetching issue:', error);
    throw new Error('Failed to fetch issue');
  }
}