import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { issues } from '@/db/schema';
import { getCurrentUser } from '@/lib/dal';
//fix the dashboard issues
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  try {
    const allIssues = await db.query.issues.findMany({
      where: (i, { eq }) => eq(i.userId, user.id), //  only this user's issues
    });
    return NextResponse.json(allIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.userId) {
      return NextResponse.json({ error: 'Title and userId are required' }, { status: 400 });
    }

    // Create the issue
    const newIssue = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        userId: data.userId,
      })
      .returning();

    return NextResponse.json(
      { message: 'Issue created successfully', issue: newIssue[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}
