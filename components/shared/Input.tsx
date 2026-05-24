import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-corporate-dark"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-corp border bg-white px-4 text-base text-corporate-dark outline-none transition-colors',
            'border-corporate-border placeholder:text-corporate-muted',
            'focus:border-gold focus:ring-2 focus:ring-gold/20',
            error && 'border-danger bg-red-50 focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
