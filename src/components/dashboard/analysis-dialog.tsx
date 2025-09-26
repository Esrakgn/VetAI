'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { handleAnalyzeBehavior, handleDetectMastitis } from '@/lib/actions';
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
import { Loader2, AlertTriangle, FileVideo, CheckCircle, Video, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type AnalysisDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: string;
  feedId: string;
  onAnalyze: (location: string, anomaly: string) => void;
};

const initialBehaviorState = {
  anomalies: null,
  error: null,
};

const initialMastitisState = {
  isMastitisRisk: null,
  detectedSigns: null,
  confidence: null,
  recommendation: null,
  error: null,
};

type BehaviorAnalysisResult = typeof initialBehaviorState;
type MastitisAnalysisResult = typeof initialMastitisState;
type AnalysisResult = BehaviorAnalysisResult | MastitisAnalysisResult;


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

export function AnalysisDialog({ open, onOpenChange, location, feedId, onAnalyze }: AnalysisDialogProps) {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [videoFileName, setVideoFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<'behavior' | 'mastitis'>('behavior');
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
  
  const resetState = () => {
      formRef.current?.reset();
      setFrames([]);
      setVideoFileName('');
      setProgress(0);
      if(videoRef.current) videoRef.current.src = "";
      setAnalysisResult(null);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };
  
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analiz Başarısız',
        description: result.error,
      });
    } else if ('anomalies' in result && result.anomalies) {
      if (result.anomalies.length > 0) {
        result.anomalies.forEach((anomaly) => {
          onAnalyze(location, anomaly);
        });
        toast({
          variant: 'destructive',
          title: 'Uyarı: Anormallik Tespit Edildi',
          description: `${result.anomalies.length} adet anormal davranış bulundu. Detaylar için sonucu inceleyin.`,
        });
      } else {
        toast({
          variant: 'default',
          className: "bg-success text-success-foreground",
          title: 'Analiz Tamamlandı',
          description: `Anormal bir davranış tespit edilmedi.`,
        });
      }
    } else if ('isMastitisRisk' in result) {
      if(result.isMastitisRisk) {
        const recommendation = result.recommendation || "Mastitis riski tespit edildi.";
        onAnalyze(location, "Mastitis Riski");
        toast({
          variant: 'destructive',
          title: 'Uyarı: Mastitis Riski Tespit Edildi',
          description: recommendation,
        });
      } else {
         toast({
            variant: 'default',
            className: "bg-success text-success-foreground",
            title: 'Analiz Tamamlandı',
            description: `Mastitis riski tespit edilmedi.`,
        });
      }
    }
  };

  const passFramesToAction = async (formData: FormData) => {
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
      
      let result;
      if (analysisType === 'mastitis') {
        result = await handleDetectMastitis(initialMastitisState, formData);
      } else {
        result = await handleAnalyzeBehavior(initialBehaviorState, formData);
      }
      handleAnalysisComplete(result);
    };

  const renderResult = () => {
    if (!analysisResult) return null;

    if ('anomalies' in analysisResult && analysisResult.anomalies) {
      return (
        <div className="py-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Genel Davranış Analizi Tamamlandı</h3>
            <div>
              <h4 className="font-semibold text-foreground">Tespit Edilen Anormallikler</h4>
              {analysisResult.anomalies.length > 0 ? (
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {analysisResult.anomalies.map((anomaly, index) => <li key={index}>{anomaly}</li>)}
                </ul>
              ) : <p className="text-sm text-muted-foreground mt-1">Anormallik tespit edilmedi.</p>}
            </div>
        </div>
      );
    }

    if ('isMastitisRisk' in analysisResult) {
      return (
        <div className="py-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center text-primary"><Activity className="mr-2 h-5 w-5" />Mastitis Analizi Tamamlandı</h3>
            
             <div className="flex items-center space-x-2">
                <p className="font-semibold">Sonuç:</p>
                {analysisResult.isMastitisRisk ? (
                <Badge variant="destructive">
                    Risk Tespit Edildi
                </Badge>
                ) : (
                <Badge className="bg-success hover:bg-success">
                    Risk Tespit Edilmedi
                </Badge>
                )}
            </div>

            {analysisResult.isMastitisRisk && (
              <>
                 <div className="flex items-center space-x-2">
                    <p className="font-semibold">Güven:</p>
                    <Badge variant={analysisResult.confidence === 'Yüksek' ? 'destructive' : 'secondary'}>{analysisResult.confidence}</Badge>
                 </div>
                 <div>
                    <h4 className="font-semibold text-foreground">Tespit Edilen Belirtiler</h4>
                     <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                        {analysisResult.detectedSigns?.map((sign, index) => <li key={index}>{sign}</li>)}
                    </ul>
                 </div>
              </>
            )}
             <div>
                <h4 className="font-semibold text-foreground">Öneri</h4>
                <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{analysisResult.recommendation}</p>
            </div>
        </div>
      );
    }
    
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <ScrollArea className="max-h-[80vh] pr-6">
        <DialogHeader>
          <DialogTitle className="font-headline">Davranış Analizi: {location}</DialogTitle>
          <DialogDescription>
             Anormallikleri veya mastitis riskini tespit etmek için analiz türünü seçin, bir video klip yükleyin ve analizi başlatın.
          </DialogDescription>
        </DialogHeader>

        {analysisResult ? (
          <div>
            {renderResult()}
             <DialogFooter>
                <Button onClick={() => handleOpenChange(false)}>Kapat</Button>
            </DialogFooter>
          </div>
        ) : (
          <form action={passFramesToAction} ref={formRef} className="space-y-4 pt-4">
            <input type="hidden" name="feedId" value={feedId} />

            <div className="flex items-center space-x-2">
                <Label htmlFor="analysis-switch">Genel Davranış</Label>
                <Switch 
                    id="analysis-switch"
                    checked={analysisType === 'mastitis'}
                    onCheckedChange={(checked) => setAnalysisType(checked ? 'mastitis' : 'behavior')}
                />
                <Label htmlFor="analysis-switch">Mastitis Riski</Label>
            </div>
            
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
                 {frames.length > 0 && <p className="text-sm text-success">{frames.length > 0}</p>}
              </div>
            )}


            {analysisType === 'behavior' && (
                <div className="space-y-2">
                <Label htmlFor="behavior-description">Beklenen Davranış</Label>
                <Textarea
                    id="behavior-description"
                    name="behaviorDescription"
                    placeholder="Örn: Hayvanlar aktif olarak hareket ediyor, grupla etkileşimde bulunuyor ve stres belirtisi göstermiyor."
                    required={analysisType === 'behavior'}
                    rows={3}
                />
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
