import { NewbornAnalysisClient } from '@/components/newborn-analysis/newborn-analysis-client';

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
    </>
  );
}
