'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AreaChart, History, LayoutDashboard, Settings, Stethoscope, Lightbulb } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

const menuItems = [
  { path: '/dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard },
  { path: '/diagnosis', label: 'Hastalık Teşhisi', icon: Stethoscope },
  { path: '/predictor', label: 'Neden Tahmini', icon: Lightbulb },
  { path: '/analysis', label: 'Analiz', icon: AreaChart },
  { path: '/history', label: 'Geçmiş Kayıtlar', icon: History },
  { path: '/settings', label: 'Ayarlar', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <Link href={item.path} legacyBehavior passHref>
                <SidebarMenuButton isActive={pathname.startsWith(item.path)}>
                  <item.icon />
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
