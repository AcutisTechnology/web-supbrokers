"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SkeletonColumn = () => (
  <div className="min-w-[280px] max-w-[300px] flex-shrink-0">
    <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-gray-100">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-6 rounded-full" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="h-3 w-2/5" />
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-1">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export function KanbanSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonColumn key={i} />
      ))}
    </div>
  );
}
