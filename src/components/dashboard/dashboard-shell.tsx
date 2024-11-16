import * as React from 'react';

import { cn } from '@/lib/utils';

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <main
      className={cn(
        'flex flex-1 flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
