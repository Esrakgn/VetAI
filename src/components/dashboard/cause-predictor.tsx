"use client"

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handlePredictCause } from '@/lib/actions';
import { Loader2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  probableCauses: null,
  error: null,
};

function PredictButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Tahmin Ediliyor...
        </>
      ) : (
        'Nedenleri Tahmin Et'
      )}
    </Button>
  );
}


export function CausePredictor() {
  const [state, formAction] = useActionState(handlePredictCause, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Tahmin Başarısız',
        description: state.error,
      });
    } else if (state.probableCauses) {
      toast({
        title: 'Tahmin Hazır',
        description: `Gözlemlenen davranış için potansiyel nedenler oluşturuldu.`,
      });
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Anormallik Nedenini Tahmin Et</CardTitle>
        <CardDescription>Belirli bir davranışın nedenlerini tahmin etmek için yapay zekayı kullanın.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} ref={formRef} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animalId">Hayvan ID</Label>
            <Input id="animalId" name="animalId" placeholder="Örn: İnek #842" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observedBehavior">Gözlemlenen Davranış</Label>
            <Textarea id="observedBehavior" name="observedBehavior" placeholder="Örn: 3+ saattir yatıyor, yemek yemiyor." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historicalData">Geçmiş Veriler (İsteğe Bağlı)</Label>
            <Textarea id="historicalData" name="historicalData" placeholder="Örn: Geçen hafta hafif ateşi vardı. Önceden sorunu yoktu." />
          </div>

          {state.error && (
            <div className="flex items-center gap-x-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <p>{state.error}</p>
            </div>
          )}

          <PredictButton />
        </form>

        {state.probableCauses && (
          <div className="mt-6">
            <h4 className="font-semibold flex items-center mb-2"><Lightbulb className="h-5 w-5 mr-2 text-primary" />Yapay Zeka Tahmin Sonuçları</h4>
            <div className="bg-secondary p-3 rounded-md text-sm text-secondary-foreground space-y-2">
               {state.probableCauses.map((cause, index) => (
                <p key={index}><span className="font-bold">{index + 1}.</span> {cause}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
