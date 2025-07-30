import { cn } from '@/lib/utils';

const CustomLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 9.5c-1.2 0-2.5 1-2.5 2.5s1.3 2.5 2.5 2.5" />
    <path d="M9.5 9.5c1.2 0 2.5 1 2.5 2.5s-1.3 2.5-2.5 2.5" />
    <path d="M12 14.5c-1.5 0-3-1-3-2.5s1.5-2.5 3-2.5" />
    <path d="M12 2a10 10 0 00-7.5 16.8V22h15v-3.2A10 10 0 0012 2z" />
    <path d="M17 14h-2v-2h-2v2h-2v2h2v2h2v-2h2z" />
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="p-1.5 bg-primary rounded-lg">
        <CustomLogoIcon className="h-7 w-7 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold font-headline text-foreground">VetAI</span>
    </div>
  );
}
