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
      <div className="p-1.5 bg-[#4fd1c5] rounded-lg">
        <svg
          className="h-7 w-7 text-background"
          viewBox="0 0 28 28"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.778 12.003h1.332v-1.33h-1.332v1.33zm-4.004 0H12.11v-1.33h-1.336v1.33z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.774 21.666c0 .736.598 1.333 1.333 1.333h.001v-2.666h-.001a1.33 1.33 0 00-1.333 1.333zm2.667 1.333h1.333V19h-1.333v3.999z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.59 13.435c-1.463 0-2.651 1.189-2.651 2.651s1.188 2.652 2.651 2.652c1.464 0 2.652-1.19 2.652-2.652s-1.188-2.651-2.652-2.651m.001-1.333c2.2 0 3.986 1.786 3.986 3.984s-1.786 3.985-3.986 3.985-3.985-1.786-3.985-3.985S8.39 12.102 10.59 12.102z"
          />
          <path d="M12.11 9.339v1.332h-1.336V9.34z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.447 13.435c1.463 0 2.652 1.189 2.652 2.651s-1.189 2.652-2.652 2.652-2.651-1.19-2.651-2.652s1.188-2.651 2.651-2.651m0-1.333c-2.2 0-3.985 1.786-3.985 3.984s1.785 3.985 3.985 3.985c2.2 0 3.985-1.786 3.985-3.985s-1.785-3.984-3.985-3.984z"
          />
          <path d="M12.11 5.34h-1.336V4h1.336v1.34z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.444 6.78c-1.026-.062-2.062.06-3.04.422C5.074 8.877 2 12.87 2 17.653c0 1.28.32 2.562.946 3.737.525.986 1.258 1.838 2.14 2.518V26h15.83v-2.092c.882-.68 1.615-1.532 2.14-2.518.627-1.175.946-2.457.946-3.737 0-4.783-3.074-8.776-8.402-10.45-1.01-.32-2.046-.44-3.06-.423zm-1.896 9.308h1.333v1.333h-1.333v-1.333zm2.668 2.666v-1.333h1.332v1.333h-1.332z"
          />
        </svg>
      </div>
      <span className="text-2xl font-bold font-headline text-foreground">VetAI</span>
    </div>
  );
}