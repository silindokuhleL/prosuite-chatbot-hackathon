'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        outline: 'border border-current bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  color?: string;
}

export function Badge({ className, variant, color, style, ...props }: BadgeProps) {
  const customStyle = color
    ? {
        ...style,
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      }
    : style;

  return (
    <span
      className={cn(badgeVariants({ variant: color ? undefined : variant }), className)}
      style={customStyle}
      {...props}
    />
  );
}

export function StatusBadge({ 
  status, 
  color 
}: { 
  status: string; 
  color: string;
}) {
  return (
    <Badge color={color}>
      <span 
        className="mr-1.5 h-1.5 w-1.5 rounded-full" 
        style={{ backgroundColor: color }}
      />
      {status}
    </Badge>
  );
}
