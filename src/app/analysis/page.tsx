'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { MapPin, AlertTriangle, Flag, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for hotspots
const hotspots = [
  { id: 1, top: '25%', left: '40%', disease: 'Kuş Gribi', color: 'bg-red-500' },
  { id: 2, top: '50%', left: '60%', disease: 'Şap Hastalığı', color: 'bg-blue-500' },
  { id: 3, top: '60%', left: '30%', disease: 'Düşük Hareketlilik', color: 'bg-yellow-500' },
  { id: 4, top: '35%', left: '75%', disease: 'Kuş Gribi', color: 'bg-red-500' },
  { id: 5, top: '70%', left: '50%', disease: 'Şap Hastalığı', color: 'bg-blue-500' },
];

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

export default function AnalysisPage() {
  const { toast } = useToast();
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleReportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowReportForm(false);
    toast({
      title: 'Rapor Gönderildi',
      description: 'Salgın bildiriminiz başarıyla alındı ve haritaya eklenecektir.',
      className: "bg-success text-success-foreground",
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Bölgesel Analiz</h1>
        <p className="text-muted-foreground">
          Harita üzerinde hastalık yayılımını ve düşük hareketlilik bölgelerini görüntüleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Canlı Hastalık Haritası</CardTitle>
                <CardDescription>Bölgenizdeki salgınları ve riskleri takip edin.</CardDescription>
              </div>
              <Button onClick={() => setShowReportForm(true)}>
                <Flag className="mr-2"/>
                Salgın Bildir
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src="https://placehold.co/1200x800"
                  alt="Bölge haritası"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="map satellite"
                />
                <div className="absolute inset-0">
                  {hotspots.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ top: hotspot.top, left: hotspot.left }}
                    >
                      <div
                        onMouseEnter={() => setSelectedHotspot(hotspot)}
                        onMouseLeave={() => setSelectedHotspot(null)}
                        className={`w-4 h-4 rounded-full ${hotspot.color} cursor-pointer animate-pulse border-2 border-background`}
                      />
                    </div>
                  ))}
                </div>
                 {selectedHotspot && (
                  <div
                    className="absolute p-2 text-sm bg-background/80 backdrop-blur-sm rounded-md shadow-lg pointer-events-none"
                    style={{
                      top: `calc(${selectedHotspot.top} - 30px)`,
                      left: `calc(${selectedHotspot.left} + 15px)`,
                    }}
                  >
                    <p className="font-bold">{selectedHotspot.disease}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          {showReportForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Salgın Bildir</CardTitle>
                <CardDescription>Bölgenizdeki bir salgını bildirerek topluluğa yardımcı olun.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="disease-type">Hastalık / Anormallik Türü</Label>
                    <Input id="disease-type" placeholder="Örn: Kuş Gribi" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input id="location" placeholder="Örn: Ankara, Çankaya" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="notes">Ek Notlar</Label>
                    <Textarea id="notes" placeholder="Gözlemlerinizi yazın..." />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={() => setShowReportForm(false)}>İptal</Button>
                    <Button type="submit">Raporu Gönder</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Bölge Bilgileri</CardTitle>
                <CardDescription>Filtrelere göre bölgesel istatistikler.</CardDescription>
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
        </div>
      </div>
    </>
  );
}
