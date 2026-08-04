'use client';
import { Skeleton } from '@/app/_components/ui/skeleton';

export default function ViewTaskPlaceholder() {
  return (
    <div className="flex flex-col gap-6">
      {/* Subtasks Skeleton */}
      <ul className="flex flex-col gap-2">
        <li>
          <Skeleton className="h-8 w-full rounded-sm" />
        </li>
        <li>
          <Skeleton className="h-8 w-5/6 rounded-sm" />
        </li>
        <li>
          <Skeleton className="h-8 w-2/3 rounded-sm" />
        </li>
      </ul>
      {/* Status Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
