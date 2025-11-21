import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { issues } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const session = await getSession();
  if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issue = await db.query.issues.findFirst({
  where: (i, { eq, and }) =>
    and(eq(i.id, parseInt(id)), eq(i.userId, session.userId)),
  });
  //   const issue = await db.query.issues.findFirst({
  //     where: eq(issues.id, parseInt(id)),
  //   });

  //   if (!issue) {
  //     return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  //   }

  //   return NextResponse.json(issue);
  // } catch (error) {
  //   console.error('Error fetching issue:', error);
  //   return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 });
  // }
}
