import { NewbornAnalysisClient } from '@/components/newborn-analysis/newborn-analysis-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export default function NewbornAnalysisPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Yeni Doğan Davranış Analizi</h1>
        <p className="text-muted-foreground">
         Yeni doğan bir hayvanın doğum sonrası davranışını analiz ederek sağlık durumunu ve risk seviyesini belirleyin.
        </p>
      </div>
      <NewbornAnalysisClient />
      <Alert className="mt-8 border-primary/50">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle className="font-semibold">Unutmayın: İlk 24 Saat Kritik Öneme Sahiptir</AlertTitle>
        <AlertDescription>
          <p className="mt-2 text-sm text-muted-foreground">
            Yeni doğan bir hayvanın hayatta kalma ve sağlıklı bir şekilde gelişme şansı, büyük ölçüde doğumdan sonraki ilk 24 saat içindeki bakım ve gözleme bağlıdır. Bu dönemde emme refleksi, hareketlilik ve genel canlılık gibi belirtiler, hayvanın sağlık durumu hakkında önemli ipuçları verir. Bu analiz aracı, bu kritik periyodu dikkatle izlemenize ve olası riskleri erken fark etmenize yardımcı olmak için tasarlanmıştır.
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
}
