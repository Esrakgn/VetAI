import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/context/language-context';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'VetAI',
  description: 'Yapay zeka destekli hayvan davranışı analizi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
          <link href="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css" rel="stylesheet" />
        </head>
        <body className="font-body antialiased bg-background text-foreground">
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <FirebaseClientProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </FirebaseClientProvider>
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </body>
    </html>
  );
}
