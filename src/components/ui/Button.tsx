import React from 'react';
import { cn } from '@/src/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'forest' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#A45C3B] text-white hover:bg-[#8A4A2E] focus-visible:ring-[#A45C3B]/40',
  forest:
    'bg-[#456B50] text-white hover:bg-[#385842] focus-visible:ring-[#456B50]/40',
  secondary:
    'bg-[#302B27] text-white hover:bg-[#463F39] focus-visible:ring-[#302B27]/40',
  outline:
    'border border-[#D5C9B8] bg-white text-[#302B27] hover:bg-[#F7F1E7] focus-visible:ring-[#A45C3B]/30',
  ghost:
    'text-[#302B27] hover:bg-[#EFE6D8] focus-visible:ring-[#A45C3B]/30',
  danger:
    'bg-[#B9382C] text-white hover:bg-[#9C2C21] focus-visible:ring-[#B9382C]/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
