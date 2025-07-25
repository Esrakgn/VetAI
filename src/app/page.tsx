
'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { RecentAlerts, type Alert } from '@/components/dashboard/recent-alerts';
import { CausePredictor } from '@/components/dashboard/cause-predictor';
import { DiseaseDiagnosis } from '@/components/dashboard/disease-diagnosis';
import { Users, AlertTriangle, ShieldCheck, LayoutDashboard, AreaChart, History, Settings, Stethoscope } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

const initialAlerts: Alert[] = [
  {
    id: 1,
    animalId: 'Hayvan #842',
    description: 'Uzun süreli hareketsizlik tespit edildi.',
    timestamp: '5 dakika önce',
    severity: 'Yüksek',
  },
  {
    id: 2,
    animalId: 'Hayvan #109',
    description: 'Grupdan ayrıldı.',
    timestamp: '2 saat önce',
    severity: 'Orta',
  },
  {
    id: 3,
    animalId: 'Hayvan #331',
    description: 'Beslenme zamanı topallama gözlendi.',
    timestamp: '8 saat önce',
    severity: 'Yüksek',
  },
  {
    id: 4,
    animalId: 'Genel',
    description: 'A Bölgesinde grup hareketliliğinde azalma.',
    timestamp: '1 gün önce',
    severity: 'Düşük',
  },
];


export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu: string, tab: string) => {
    setActiveMenu(menu);
    setActiveTab(tab);
  };

  const addAlert = (location: string, anomaly: string) => {
    const newAlert: Alert = {
      id: alerts.length + 1,
      animalId: `Konum: ${location}`,
      description: anomaly,
      timestamp: 'Şimdi',
      severity: 'Yüksek'
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    handleMenuClick('dashboard', 'alerts');
  };
  
  const getTabForMenu = (menu: string) => {
    switch (menu) {
      case 'dashboard':
        return 'alerts';
      case 'diagnosis':
        return 'diagnosis';
      default:
        return 'alerts';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeMenu === 'dashboard'}
                onClick={() => handleMenuClick('dashboard', getTabForMenu('dashboard'))}
              >
                <LayoutDashboard />
                Kontrol Paneli
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeMenu === 'diagnosis'}
                onClick={() => handleMenuClick('diagnosis', 'diagnosis')}
              >
                <Stethoscope />
                Hastalık Teşhisi
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeMenu === 'analysis'}
                onClick={() => handleMenuClick('analysis', 'analysis')}
              >
                <AreaChart />
                Analiz
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeMenu === 'history'}
                onClick={() => handleMenuClick('history', 'history')}
              >
                <History />
                Geçmiş Kayıtlar
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeMenu === 'settings'}
                onClick={() => handleMenuClick('settings', 'settings')}
              >
                <Settings />
                Ayarlar
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground">Kontrol Paneli</h1>
                <p className="text-muted-foreground">Tekrar hoş geldiniz, işte hayvanlarınızın genel durumu.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Toplam Hayvan" value="1,250" icon={<Users className="h-8 w-8 text-primary" />} description="Geçen aydan beri +12" />
                <StatCard title="Aktif Alarmlar" value={alerts.length.toString()} icon={<AlertTriangle className="h-8 w-8 text-destructive" />} description="Dinamik olarak güncellendi" />
                <StatCard title="Sağlık Durumu" value="%99.04" icon={<ShieldCheck className="h-8 w-8 text-success" />} description="Stabil" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <VideoFeeds onAnalyze={addAlert} />
                </div>
                <div className="space-y-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="alerts">Son Alarmlar</TabsTrigger>
                      <TabsTrigger value="predictor">Neden Tahmini</TabsTrigger>
                      <TabsTrigger value="diagnosis">Hastalık Teşhisi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="alerts" className="mt-4">
                      <RecentAlerts alerts={alerts} />
                    </TabsContent>
                    <TabsContent value="predictor" className="mt-4">
                      <CausePredictor />
                    </TabsContent>
                    <TabsContent value="diagnosis" className="mt-4">
                      <DiseaseDiagnosis />
                    </TabsContent>
                    {/* Dummy content for other tabs to prevent warnings */}
                    <TabsContent value="analysis"></TabsContent>
                    <TabsContent value="history"></TabsContent>
                    <TabsContent value="settings"></TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
