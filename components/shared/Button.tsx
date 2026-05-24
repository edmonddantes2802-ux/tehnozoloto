import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-corp font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-white hover:bg-gold-dark hover:-translate-y-[1px] hover:shadow-gold-glow active:translate-y-0',
        secondary:
          'bg-primary text-white hover:bg-primary/90 hover:-translate-y-[1px]',
        outline:
          'border-2 border-gold text-gold hover:bg-gold hover:text-white',
        ghost: 'text-primary hover:bg-corporate-bg',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-7 py-3 text-base',
        lg: 'px-8 py-4 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
