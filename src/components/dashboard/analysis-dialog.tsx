'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
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
import { Loader2, AlertTriangle, FileVideo, CheckCircle, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useActionState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

function SubmitButton({ framesCaptured }: { framesCaptured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !framesCaptured}>
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
  const [frames, setFrames] = useState<string[]>([]);
  const [videoFileName, setVideoFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (videoRef.current) {
          videoRef.current.src = loadEvent.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const captureFrames = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const capturedFrames: string[] = [];
    const frameCount = 5;
    const duration = video.duration;

    if (!context || isNaN(duration) || duration === 0) {
       toast({
        variant: 'destructive',
        title: 'Video Hatası',
        description: 'Video yüklenemedi veya süresi sıfır. Lütfen farklı bir dosya deneyin.',
      });
      setProgress(0);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let framesCaptured = 0;

    const captureFrame = () => {
        if (framesCaptured >= frameCount) {
            setFrames(capturedFrames);
            setProgress(100);
            return;
        }

        const time = (duration / (frameCount + 1)) * (framesCaptured + 1);
        video.currentTime = time;
    };

    video.onseeked = () => {
        if (framesCaptured >= frameCount || !context) return;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        capturedFrames.push(dataUri);
        framesCaptured++;
        
        const newProgress = (framesCaptured / frameCount) * 100;
        setProgress(newProgress);
        
        captureFrame();
    }
    
    video.onloadeddata = () => {
        captureFrame();
    };

    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        captureFrame();
    }
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
      setFrames([]);
      setVideoFileName('');
      setProgress(0);
      if(videoRef.current) videoRef.current.src = "";
    }
    onOpenChange(isOpen);
  };
  
  const passFramesToAction = (formData: FormData) => {
      if (frames.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Kareler eksik',
          description: 'Lütfen analizden önce videodan kareleri yakalayın.',
        });
        return; 
      }
      frames.forEach((frame) => {
        formData.append(`frames`, frame);
      });
      formAction(formData);
    };


  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analiz Başarısız',
        description: state.error,
      });
    } else if (state.anomalies && state.anomalies.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Uyarı: Anormallik Tespit Edildi',
        description: `${state.anomalies.length} adet anormal davranış bulundu. Detaylar için sonucu inceleyin.`,
      });
    } else if (state.anomalies) {
       toast({
        variant: 'default',
        className: "bg-success text-success-foreground",
        title: 'Analiz Tamamlandı',
        description: `Anormal bir davranış tespit edilmedi.`,
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <ScrollArea className="max-h-[80vh] pr-6">
        <DialogHeader>
          <DialogTitle className="font-headline">Davranış Analizi: {location}</DialogTitle>
          <DialogDescription>
            Anormallikleri tespit etmek için bir video klip yükleyin, kareleri yakalayın ve beklenen normal davranışları tanımlayın.
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
          <form action={passFramesToAction} ref={formRef} className="space-y-4 pt-4">
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

            {videoFileName && (
              <div className="space-y-3">
                 <video ref={videoRef} className="w-full rounded-md bg-black" controls muted />
                 <Button type="button" variant="secondary" onClick={captureFrames} disabled={progress > 0 && progress < 100}>
                   <Video className="mr-2"/>
                   Kareleri Yakala
                 </Button>
                 {progress > 0 && <Progress value={progress} className="w-full" />}
                 {frames.length > 0 && <p className="text-sm text-success">{frames.length} kare başarıyla yakalandı.</p>}
              </div>
            )}


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
                <Button variant="ghost" type="button" onClick={() => handleOpenChange(false)}>İptal</Button>
                <SubmitButton framesCaptured={frames.length > 0} />
            </DialogFooter>
          </form>
        )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
