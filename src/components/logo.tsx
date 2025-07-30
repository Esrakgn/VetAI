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
    <path d="M11 4H9C7.89543 4 7 4.89543 7 6V7" />
    <path d="M15 4H17C18.1046 4 19 4.89543 19 6V7" />
    <path d="M7 14V12C7 10.8954 7.89543 10 9 10H17C18.1046 10 19 10.8954 19 12V14" />
    <path d="M10 18H16" />
    <path d="M13 15V21" />
    <path d="M18 18H22" />
    <path d="M20 16V20" />
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
