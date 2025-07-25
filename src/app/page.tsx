import { Header } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { VideoFeeds } from '@/components/dashboard/video-feeds';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { CausePredictor } from '@/components/dashboard/cause-predictor';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, here's your herd's overview.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Animals" value="1,250" icon={<Users className="h-8 w-8 text-primary" />} description="+12 since last month" />
            <StatCard title="Active Alerts" value="12" icon={<AlertTriangle className="h-8 w-8 text-destructive" />} description="-3 since yesterday" />
            <StatCard title="Health Status" value="99.04%" icon={<ShieldCheck className="h-8 w-8 text-success" />} description="Stable" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <VideoFeeds />
            </div>
            <div className="space-y-8">
              <RecentAlerts />
              <CausePredictor />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
