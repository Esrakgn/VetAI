'use client';

import { useFormStatus } from 'react-dom';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleAnalyzeNewborn } from '@/lib/actions';
import { Loader2, FileVideo, Video, CheckCircle, Activity, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  sucklingBehavior: null,
  activityLevel: null,
  riskScore: null,
  summary: null,
  timestamps: null,
  error: null,
};

type AnalysisResult = typeof initialState;


function SubmitButton({ framesCaptured }: { framesCaptured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !framesCaptured} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analiz Ediliyor...
        </>
      ) : (
        'Davranışı Analiz Et'
      )}
    </Button>
  );
}

export function NewbornAnalysisClient() {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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
    const frameCount = 10; // More frames for better behavior analysis
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
    };

    video.onloadeddata = () => {
      captureFrame();
    };

    if (video.readyState >= 2) {
      captureFrame();
    }
  };
  
  const resetState = () => {
    formRef.current?.reset();
    setFrames([]);
    setVideoFileName('');
    setProgress(0);
    if(videoRef.current) videoRef.current.src = "";
    setAnalysisResult(null);
  }

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

    const result = await handleAnalyzeNewborn(initialState, formData);
    setAnalysisResult(result);

     if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analiz Başarısız',
        description: result.error,
      });
    } else {
       toast({
        title: 'Analiz Tamamlandı',
        description: `Yeni doğan davranış analizi tamamlandı.`,
      });
    }
  };
  
  const getRiskProps = (score: number | null) => {
    if (score === null) return { variant: 'default', icon: ShieldCheck, label: 'Bilinmiyor' };
    if (score >= 70) return { variant: 'destructive', icon: ShieldAlert, label: 'Yüksek Risk' };
    if (score >= 40) return { variant: 'secondary', icon: ShieldCheck, label: 'Orta Risk' };
    return { variant: 'success', icon: ShieldCheck, label: 'Düşük Risk' };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Analiz Paneli</CardTitle>
                    <CardDescription>Yeni doğanın ilk saatlerini içeren bir video klip yükleyin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={passFramesToAction} ref={formRef} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="video-upload-newborn">Video Klip</Label>
                            <Input id="video-upload-newborn" type="file" accept="video/*" onChange={handleFileChange} required />
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
                        
                        <SubmitButton framesCaptured={frames.length > 0} />
                    </form>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Analiz Sonucu</CardTitle>
                    <CardDescription>Yeni doğan davranış analizi sonuçları burada görünecektir.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    {analysisResult?.summary ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Analiz Tamamlandı</h3>
                            
                            <div className="flex items-center space-x-2">
                                <p className="font-semibold">Risk Durumu:</p>
                                <Badge className={`bg-${getRiskProps(analysisResult.riskScore).variant} hover:bg-${getRiskProps(analysisResult.riskScore).variant}`}>
                                    <svelte:component this={getRiskProps(analysisResult.riskScore).icon} className="mr-2 h-4 w-4" />
                                    {getRiskProps(analysisResult.riskScore).label} (Skor: {analysisResult.riskScore})
                                </Badge>
                            </div>

                            <Alert>
                                <AlertTitle>Özet</AlertTitle>
                                <AlertDescription>
                                    {analysisResult.summary}
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                    <CardTitle className="text-sm font-medium">Emme Davranışı</CardTitle>
                                    <CardDescription className="text-2xl font-bold">{analysisResult.sucklingBehavior}</CardDescription>
                                </Card>
                                 <Card className="p-4">
                                    <CardTitle className="text-sm font-medium">Hareket Seviyesi</CardTitle>
                                    <CardDescription className="text-2xl font-bold">{analysisResult.activityLevel}</CardDescription>
                                </Card>
                            </div>

                            <Button onClick={resetState}>Yeni Analiz Başlat</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Activity className="w-12 h-12 mb-4" />
                            <p>Henüz bir analiz yapılmadı.</p>
                            <p className="text-sm">Lütfen bir video yükleyip analizi başlatın.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
