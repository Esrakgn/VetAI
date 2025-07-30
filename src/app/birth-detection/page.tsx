
import { BirthDetectionClient } from '@/components/birth-detection/birth-detection-client';

export default function BirthDetectionPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Doğum Tespiti</h1>
        <p className="text-muted-foreground">
         Bir kamera akışı seçin, bir video klip yükleyin ve doğum olayını tespit etmek için analizi başlatın.
        </p>
      </div>
      <BirthDetectionClient />
    </>
  );
}
