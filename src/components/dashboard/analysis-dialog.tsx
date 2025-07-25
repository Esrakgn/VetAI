'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef, useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleAnalyzeBehavior } from '@/lib/actions';
import { Loader2, AlertTriangle, FileVideo, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type AnalysisDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: string;
  feedId: string;
};

const initialState = {
  anomalies: null,
  causePrediction: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analiz Ediliyor...
        </>
      ) : (
        'Analizi Başlat'
      )}
    </Button>
  );
}

export function AnalysisDialog({ open, onOpenChange, location, feedId }: AnalysisDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleAnalyzeBehavior, initialState);
  const [videoDataUri, setVideoDataUri] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setVideoDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
      setVideoDataUri('');
      setVideoFileName('');
    }
    onOpenChange(isOpen);
  };

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analiz Başarısız',
        description: state.error,
      });
    } else if (state.anomalies) {
       toast({
        variant: 'default',
        className: "bg-success text-success-foreground",
        title: 'Analiz Tamamlandı',
        description: `${state.anomalies.length} anormallik bulundu.`,
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Davranış Analizi: {location}</DialogTitle>
          <DialogDescription>
            Anormallikleri tespit etmek için bir video klip yükleyin ve beklenen normal davranışları tanımlayın.
          </DialogDescription>
        </DialogHeader>

        {state.anomalies ? (
          <div className="py-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Analiz Tamamlandı</h3>
            <div>
              <h4 className="font-semibold text-foreground">Tespit Edilen Anormallikler</h4>
              {state.anomalies.length > 0 ? (
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {state.anomalies.map((anomaly, index) => <li key={index}>{anomaly}</li>)}
                </ul>
              ) : <p className="text-sm text-muted-foreground mt-1">Anormallik tespit edilmedi.</p>}
            </div>
             <div>
              <h4 className="font-semibold text-foreground">Olası Nedenler</h4>
              <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{state.causePrediction}</p>
            </div>
            <DialogFooter>
                <Button onClick={() => handleOpenChange(false)}>Kapat</Button>
            </DialogFooter>
          </div>
        ) : (
          <form action={formAction} ref={formRef} className="space-y-4">
            <input type="hidden" name="videoDataUri" value={videoDataUri} />
            <input type="hidden" name="feedId" value={feedId} />
            
            <div className="space-y-2">
              <Label htmlFor="video-upload">Video Klip</Label>
              <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} required />
               {videoFileName && (
                <div className="text-xs text-muted-foreground flex items-center gap-2 pt-1">
                  <FileVideo className="h-4 w-4" />
                  <span>{videoFileName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="behavior-description">Beklenen Davranış</Label>
              <Textarea
                id="behavior-description"
                name="behaviorDescription"
                placeholder="Örn: Hayvanlar aktif olarak otluyor, merada hareket ediyor ve sürüden ayrılma veya rahatsızlık belirtisi göstermiyor."
                required
                rows={4}
              />
            </div>

            {state.error && (
              <div className="flex items-center gap-x-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p>{state.error}</p>
              </div>
            )}

            <DialogFooter>
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>İptal</Button>
                <SubmitButton />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
