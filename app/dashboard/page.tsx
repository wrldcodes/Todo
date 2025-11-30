import { getIssues, getCurrentUser } from '@/lib/dal';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { PlusIcon } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { RelativeTime } from '../components/RelativeTime';
import { Priority, Status } from '@/lib/types';
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const issues = user ? await getIssues(user.id) : [];
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issues</h1>
        <Link href="/issues/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Issue
            </span>
          </Button>
        </Link>
      </div>

      {issues.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-[#121212] shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-dark-border-subtle">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-3">Created</div>
          </div>

          {/* Issue rows */}
          <div className=" divide-y divide-gray-200 dark:divide-dark-border-subtle">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-5 font-medium truncate text-gray-900 dark:text-gray-100">
                    {issue.title}
                  </div>
                  <div className="col-span-2">
                    <Badge status={issue.status as Status}>
                      {ISSUE_STATUS[issue.status as Status].label}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge priority={issue.priority as Priority}>
                      {ISSUE_PRIORITY[issue.priority as Priority].label}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                    <RelativeTime date={issue.createdAt} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-subtle rounded-lg bg-white dark:bg-[#121212] p-8">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            No issues found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first issue.
          </p>
          <Link href="/issues/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Create Issue
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
