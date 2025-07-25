import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="p-2 bg-primary rounded-lg">
        <HeartPulse className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold font-headline text-foreground">BehavioVet</span>
    </div>
  );
}
