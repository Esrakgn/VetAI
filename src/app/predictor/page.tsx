
import { CausePredictor } from '@/components/dashboard/cause-predictor';

export default function PredictorPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Anormallik Nedenini Tahmin Et</h1>
        <p className="text-muted-foreground">
          Yapay zeka kullanarak belirli bir anormal davranışın olası nedenlerini belirleyin.
        </p>
      </div>
      <div className="max-w-2xl">
        <CausePredictor />
      </div>
    </>
  );
}
