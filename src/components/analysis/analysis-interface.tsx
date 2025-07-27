
'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Flag, CheckCircle } from 'lucide-react';

const provinces = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta", "Mersin",
    "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
    "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
    "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

type AnalysisInterfaceProps = {
  onReportSubmit: (disease: string, location: string) => void;
};

export function AnalysisInterface({ onReportSubmit }: AnalysisInterfaceProps) {
    const { toast } = useToast();
    const [showReportForm, setShowReportForm] = useState(false);

    const handleReportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const disease = formData.get('disease-type') as string;
        const location = formData.get('location') as string;
        
        onReportSubmit(disease, location);

        setShowReportForm(false);
        (event.target as HTMLFormElement).reset();

        toast({
        title: 'Rapor Gönderildi',
        description: 'Salgın bildiriminiz başarıyla alındı ve haritaya eklendi.',
        className: "bg-success text-success-foreground",
        });
    };
    
    return (
        <>
             {showReportForm ? (
                <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Salgın Bildir</CardTitle>
                            <CardDescription>Bölgenizdeki bir salgını bildirerek topluluğa yardımcı olun.</CardDescription>
                        </div>
                         <Button variant="ghost" size="sm" onClick={() => setShowReportForm(false)}>Geri</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="disease-type">Hastalık / Anormallik Türü</Label>
                        <Input id="disease-type" name="disease-type" placeholder="Örn: Kuş Gribi" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Konum</Label>
                        <Input id="location" name="location" placeholder="Örn: Ankara, Çankaya" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Ek Notlar</Label>
                        <Textarea id="notes" name="notes" placeholder="Gözlemlerinizi yazın..." />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setShowReportForm(false)}>İptal</Button>
                        <Button type="submit">Raporu Gönder</Button>
                    </div>
                    </form>
                </CardContent>
                </Card>
            ) : (
                <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Bölge Bilgileri</CardTitle>
                            <CardDescription>Filtrelere göre bölgesel istatistikler.</CardDescription>
                        </div>
                        <Button onClick={() => setShowReportForm(true)}>
                            <Flag className="mr-2"/>
                            Salgın Bildir
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label>Konum Filtresi</Label>
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="Bir il seçin" />
                        </SelectTrigger>
                        <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem key={province} value={province.toLowerCase().replace(/ /g, '-')}>{province}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex p-4 bg-secondary rounded-lg items-start">
                        <AlertTriangle className="h-6 w-6 text-destructive mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-destructive">Yüksek Risk: Kuş Gribi</h4>
                            <p className="text-sm text-muted-foreground">Seçilen bölgede son 7 günde 4 yeni vaka rapor edildi. Lütfen önlemleri artırın.</p>
                        </div>
                    </div>
                    <div className="flex p-4 bg-secondary rounded-lg items-start">
                        <CheckCircle className="h-6 w-6 text-success mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-success">Düşük Risk: Şap Hastalığı</h4>
                            <p className="text-sm text-muted-foreground">Bölgede aktif şap salgını bulunmamaktadır.</p>
                        </div>
                    </div>
                </CardContent>
                </Card>
            )}
        </>
    )

}
