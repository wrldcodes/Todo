import { Suspense } from 'react';

export default function IssueLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading issue…</div>}>{children}</Suspense>;
}
