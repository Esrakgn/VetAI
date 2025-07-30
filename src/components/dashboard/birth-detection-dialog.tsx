'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef, useActionState } from 'react';
import Image from 'next/image';
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
import { Label } from '@/components/ui/label';
import { handleDetectBirth } from '@/lib/actions';
import { Loader2, AlertTriangle, FileVideo, CheckCircle, Video, PartyPopper, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';

type BirthDetectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: string;
  feedId: string;
};

const initialState = {
  isBirthDetected: null,
  estimatedBirthTime: null,
  keyFrame: null,
  evidence: null,
  error: null,
};

function SubmitButton({ framesCaptured }: { framesCaptured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !framesCaptured}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Tespit Ediliyor...
        </>
      ) : (
        'Doğumu Tespit Et'
      )}
    </Button>
  );
}

export function BirthDetectionDialog({ open, onOpenChange, location, feedId }: BirthDetectionDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleDetectBirth, initialState);
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
      // Reset state when dialog closes
      formRef.current?.reset();
      setFrames([]);
      setVideoFileName('');
      setProgress(0);
      if(videoRef.current) videoRef.current.src = "";
      // A trick to reset the useActionState
      (formAction as any)(initialState);
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
        title: 'Tespit Başarısız',
        description: state.error,
      });
    } else if (state.isBirthDetected) {
      toast({
        className: "bg-success text-success-foreground",
        title: 'Doğum Tespit Edildi!',
        description: `Konum: ${location}. Detaylar için sonucu inceleyin.`,
      });
    } else if (state.isBirthDetected === false) {
       toast({
        title: 'Analiz Tamamlandı',
        description: `Doğum tespit edilmedi.`,
      });
    }
  }, [state, toast, location]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <ScrollArea className="max-h-[80vh] pr-6">
          <DialogHeader>
            <DialogTitle className="font-headline">Doğum Tespiti: {location}</DialogTitle>
            <DialogDescription>
              Doğum olayını tespit etmek için bir video klip yükleyin, kareleri yakalayın ve analizi başlatın.
            </DialogDescription>
          </DialogHeader>

          {state.evidence ? (
            <div className="py-4 space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Tespit Tamamlandı</h3>
              
              <div className="flex items-center space-x-2">
                <p className="font-semibold">Sonuç:</p>
                {state.isBirthDetected ? (
                  <Badge className="bg-success hover:bg-success">
                    <PartyPopper className="mr-2 h-4 w-4" />
                    Doğum Tespit Edildi
                  </Badge>
                ) : (
                   <Badge variant="secondary">
                     <XCircle className="mr-2 h-4 w-4" />
                     Doğum Tespit Edilmedi
                   </Badge>
                )}
              </div>

              {state.isBirthDetected && (
                 <div>
                    <h4 className="font-semibold text-foreground">Tahmini Doğum Zamanı</h4>
                    <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{state.estimatedBirthTime}</p>
                </div>
              )}
              
               <div>
                <h4 className="font-semibold text-foreground">Kanıt</h4>
                <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{state.evidence}</p>
              </div>

              {state.keyFrame && (
                <div>
                  <h4 className="font-semibold text-foreground">Ekran Görüntüsü</h4>
                   <div className="mt-2 relative border rounded-md p-2">
                    <Image src={state.keyFrame} alt="Doğum kanıtı" width={600} height={400} className="w-full h-auto rounded-md" />
                   </div>
                </div>
              )}

              <DialogFooter>
                  <Button onClick={() => handleOpenChange(false)}>Kapat</Button>
              </DialogFooter>
            </div>
          ) : (
            <form action={passFramesToAction} ref={formRef} className="space-y-4 pt-4">
              <input type="hidden" name="feedId" value={feedId} />
              
              <div className="space-y-2">
                <Label htmlFor="video-upload-birth">Video Klip</Label>
                <Input id="video-upload-birth" type="file" accept="video/*" onChange={handleFileChange} required />
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
