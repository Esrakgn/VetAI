import { ProfileCard } from '@/components/settings/profile-card';
import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground">Ayarlar</h1>
                <p className="text-muted-foreground">Hesap bilgilerinizi yönetin ve tercihlerinizi kişiselleştirin.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <ProfileCard />
                </div>
                <div className="lg:col-span-2">
                    <SettingsForm />
                </div>
            </div>
        </>
    )
}
