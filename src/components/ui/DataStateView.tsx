import React from 'react';
import { AlertCircle, PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface DataStateViewProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  skeletonCount?: number;
  children: React.ReactNode;
}

export function DataStateView({
  isLoading,
  error,
  isEmpty,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filter criteria.',
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  skeletonCount = 3,
  children,
}: DataStateViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-3 animate-pulse"
          >
            <div className="aspect-[4/3] w-full rounded-lg bg-[#EFE7DA]" />
            <div className="h-3 w-1/3 rounded bg-[#EFE7DA]" />
            <div className="h-5 w-4/5 rounded bg-[#EFE7DA]" />
            <div className="h-4 w-1/4 rounded bg-[#EFE7DA]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#B9382C]/25 bg-white p-8 text-center space-y-3">
        <AlertCircle className="h-8 w-8 text-[#B9382C] mx-auto" />
        <h3 className="font-serif text-xl font-semibold text-[#302B27]">
          Unable to load data
        </h3>
        <p className="text-sm text-[#6B625B] max-w-md mx-auto">{error}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-[#E5DCD0] bg-white p-10 text-center space-y-3">
        <PackageOpen className="h-9 w-9 text-[#A45C3B]/70 mx-auto" />
        <h3 className="font-serif text-xl font-semibold text-[#302B27]">
          {emptyTitle}
        </h3>
        <p className="text-sm text-[#6B625B] max-w-md mx-auto">{emptyDescription}</p>
        {emptyActionLabel && onEmptyAction ? (
          <Button variant="primary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
