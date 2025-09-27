'use client';

import { Header } from '@/components/dashboard/header';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="container mx-auto">
                  {children}
              </div>
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
