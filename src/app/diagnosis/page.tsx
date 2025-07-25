
import { DiseaseDiagnosis } from '@/components/dashboard/disease-diagnosis';

export default function DiagnosisPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Hastalık Teşhisi</h1>
        <p className="text-muted-foreground">
          Bir hayvanın fotoğrafını yükleyin ve semptomlarını açıklayarak olası hastalıkları teşhis edin.
        </p>
      </div>
      <div className="max-w-2xl">
        <DiseaseDiagnosis />
      </div>
    </>
  );
}
