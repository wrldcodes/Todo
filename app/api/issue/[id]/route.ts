import { NextResponse } from 'next/server';
import { db } from '@/db';
import { issues } from '@/db/schema';
import { eq } from 'drizzle-orm';


type IssueRouteContext = {
  params: Promise<{ id: string }>;
};

// This route now treats `[id]` as a *userId* and returns the first issue for that user.
// If you want all issues for a user instead of just one, we can adjust this further.
export async function GET(request: Request, { params }: IssueRouteContext) {
  try {
    const { id } = await params;

    const issue = await db.query.issues.findFirst({
      where: eq(issues.userId, id),
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 });
  }
}
