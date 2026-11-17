import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  aspectClass,
  fallbackLabel,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-[#EFE7DA] text-[#6B625B] p-4 text-center',
          aspectClass,
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-[#A45C3B]/70" />
        <span className="text-xs font-medium line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={cn('object-cover', aspectClass, className)}
      loading="lazy"
    />
  );
}
