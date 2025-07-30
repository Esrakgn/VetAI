
import { BirthDetectionClient } from '@/components/birth-detection/birth-detection-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, LocateFixed, Eye, Sunrise, Wind, Scaling, ShieldCheck } from 'lucide-react';

export default function BirthDetectionPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Doğum Tespiti</h1>
        <p className="text-muted-foreground">
         Bir kamera akışı seçin, bir video klip yükleyin ve doğum olayını tespit etmek için analizi başlatın.
        </p>
      </div>

      <Alert className="mb-8 border-primary/50">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle className="font-semibold">Kamera Yerleşimi İçin Öneriler</AlertTitle>
          <AlertDescription>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                        <LocateFixed className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Kamera, yeni doğan alanına veya doğum bölmesine bakacak şekilde yerleştirilmelidir.</span>
                    </li>
                    <li className="flex items-start">
                        <Eye className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Görüntü açısı, hayvanın yan profilden veya hafif üst açıdan tüm vücudunu görecek şekilde ayarlanmalıdır.</span>
                    </li>
                    <li className="flex items-start">
                        <Sunrise className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Geniş açılı (wide angle) kamera tercih edilmelidir; böylece zemindeki kan/sıvı izleri ve yavrunun doğum anı kolayca algılanır.</span>
                    </li>
                    <li className="flex items-start">
                        <Wind className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Gece görüş (IR) özelliği olan kameralar, düşük ışıklı ortamlarda bile doğru tespit yapılmasını sağlar.</span>
                    </li>

                    <li className="flex items-start">
                        <Scaling className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Kamera yüksekliği genellikle 1.5 – 2 metre arası olmalı ve doğum alanını ortalayacak şekilde sabitlenmelidir.</span>
                    </li>
                    <li className="flex items-start">
                        <ShieldCheck className="mr-3 mt-1 h-4 w-4 shrink-0 text-primary"/>
                        <span>Lensin doğum sırasında kirlenmemesi için mümkünse kamera koruma kutusu (housing) kullanılmalıdır.</span>
                    </li>
                </ul>
          </AlertDescription>
        </Alert>

      <BirthDetectionClient />
    </>
  );
}
