'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '../ui/separator';
import { useLanguage } from '@/context/language-context';

export function SettingsForm() {
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedLanguage = formData.get('language') as 'tr' | 'en';
    setLanguage(selectedLanguage);

    toast({
      title: 'Ayarlar Kaydedildi',
      description: 'Profil bilgileriniz başarıyla güncellendi.',
      className: 'bg-success text-success-foreground',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Ayarlar</CardTitle>
        <CardDescription>Profil bilgilerinizi ve tercihlerinizi buradan düzenleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input id="username" name="username" defaultValue="Vet AI Kullanıcısı" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select name="role" defaultValue="farmer">
              <SelectTrigger id="role">
                <SelectValue placeholder="Rolünüzü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Çiftçi</SelectItem>
                <SelectItem value="vet">Veteriner</SelectItem>
                <SelectItem value="admin">Yönetici</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dil ve Bölge</h3>
             <div className="space-y-2">
                <Label htmlFor="language">Dil</Label>
                <Select name="language" defaultValue={language}>
                <SelectTrigger id="language">
                    <SelectValue placeholder="Dil seçin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bildirim Tercihleri</h3>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div>
                <Label htmlFor="email-notifications" className="font-normal">E-posta Bildirimleri</Label>
                <p className="text-xs text-muted-foreground">Kritik alarmlar ve özet raporlar için.</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div>
                <Label htmlFor="push-notifications" className="font-normal">Anlık Bildirimler</Label>
                <p className="text-xs text-muted-foreground">Mobil cihazınıza anlık uyarılar alın.</p>
              </div>
              <Switch id="push-notifications" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Değişiklikleri Kaydet</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
