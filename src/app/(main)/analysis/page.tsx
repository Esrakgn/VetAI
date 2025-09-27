'use client';

import { AnalysisContainer } from '@/components/analysis/analysis-container';

export default function AnalysisPage() {

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">Bölgesel Analiz</h1>
        <p className="text-muted-foreground">
          Harita üzerinde hastalık yayılımını ve düşük hareketlilik bölgelerini görüntüleyin.
        </p>
      </div>
      <AnalysisContainer />
    </>
  );
}
