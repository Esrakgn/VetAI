'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef, useActionState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleDiagnoseDisease } from '@/lib/actions';
import { Loader2, AlertTriangle, Lightbulb, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const initialState = {
  isDisease: null,
  disease: null,
  confidence: null,
  recommendation: null,
  error: null,
};

function DiagnoseButton({ photoUploaded }: { photoUploaded: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !photoUploaded} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Teşhis Ediliyor...
        </>
      ) : (
        'Hastalığı Teşhis Et'
      )}
    </Button>
  );
}

export function DiseaseDiagnosis() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleDiagnoseDisease, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        setPhotoDataUri(result);
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const passToAction = (formData: FormData) => {
      if (!photoDataUri) {
        toast({
          variant: 'destructive',
          title: 'Fotoğraf eksik',
          description: 'Lütfen teşhis işleminden önce bir fotoğraf yükleyin.',
        });
        return;
      }
      formData.append('photoDataUri', photoDataUri);
      formAction(formData);
  }

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Teşhis Başarısız',
        description: state.error,
      });
    } else if (state.disease) {
      toast({
        title: 'Teşhis Hazır',
        description: 'Potansiyel hastalık teşhisi oluşturuldu.',
      });
      formRef.current?.reset();
      setPhotoPreview(null);
      setPhotoDataUri(null);
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Hastalık Teşhisi</CardTitle>
        <CardDescription>
          Bir hayvanın fotoğrafını yükleyin ve semptomlarını açıklayarak olası hastalıkları teşhis edin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={passToAction} ref={formRef} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Fotoğraf</Label>
            <Input id="photo-upload" name="photo" type="file" accept="image/*" onChange={handleFileChange} required />
             {photoPreview && (
                <div className="mt-4 relative border rounded-md p-2">
                  <Image src={photoPreview} alt="Yüklenen fotoğraf önizlemesi" width={200} height={200} className="w-full h-auto rounded-md" />
                </div>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms-description">Semptomların Açıklaması</Label>
            <Textarea
              id="symptoms-description"
              name="description"
              placeholder="Örn: Hayvanın gözünde akıntı var ve normalden daha az hareket ediyor."
              required
              rows={3}
            />
          </div>

          {state.error && (
            <div className="flex items-center gap-x-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <p>{state.error}</p>
            </div>
          )}
          
          <DiagnoseButton photoUploaded={!!photoDataUri} />
        </form>

        {state.disease && (
           <div className="mt-6 space-y-4">
             <h4 className="font-semibold flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-primary" />Yapay Zeka Teşhis Sonucu</h4>
             <div className="bg-secondary p-4 rounded-md text-sm text-secondary-foreground space-y-3">
                <div className="flex items-center">
                  {state.isDisease ? <XCircle className="h-5 w-5 mr-2 text-destructive" /> : <CheckCircle className="h-5 w-5 mr-2 text-success" />}
                  <span className="font-bold">Teşhis:</span>
                  <span className="ml-2">{state.disease}</span>
                </div>
                 { state.isDisease && (
                    <div className="flex items-center">
                        <span className="font-bold">Güven:</span>
                        <Badge variant={state.confidence === 'Yüksek' ? 'destructive' : 'secondary'} className="ml-2">{state.confidence}</Badge>
                    </div>
                 )}
                <div>
                  <p className="font-bold mb-1">Öneri:</p>
                  <p>{state.recommendation}</p>
                </div>
             </div>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
