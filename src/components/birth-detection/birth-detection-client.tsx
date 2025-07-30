'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef, useActionState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleDetectBirth } from '@/lib/actions';
import { Loader2, AlertTriangle, FileVideo, CheckCircle, Video, PartyPopper, XCircle, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';

const cameraFeeds = [
  { id: 'facility-1', location: 'Tesis 1 - Bölüm A' },
  { id: 'field-a', location: 'Açık Alan A' },
  { id: 'nursery-1', location: 'Bakım Odası' },
  { id: 'common-area', location: 'Ortak Alan' },
];

const getInitialState = () => ({
  isBirthDetected: null,
  estimatedBirthTime: null,
  keyFrame: null,
  evidence: null,
  error: null,
  // Add a key to force re-rendering and state reset
  key: Date.now(), 
});

function SubmitButton({ framesCaptured }: { framesCaptured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !framesCaptured} className="w-full">
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

export function BirthDetectionClient() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleDetectBirth, getInitialState());
  
  const [frames, setFrames] = useState<string[]>([]);
  const [videoFileName, setVideoFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedFeed, setSelectedFeed] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const doCaptureFrame = () => {
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
      doCaptureFrame();
    };

    video.onloadeddata = () => {
       video.currentTime = 0.1;
    };
    
    // Handle case where video is already loaded
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        video.currentTime = 0.1;
    }
  };
  
  const resetState = () => {
    formRef.current?.reset();
    if(fileInputRef.current) fileInputRef.current.value = "";
    setFrames([]);
    setVideoFileName('');
    setProgress(0);
    if(videoRef.current) videoRef.current.src = "";
    // This is the correct way to trigger a reset with useActionState
    // by re-invoking the initializer. We can't call formAction directly here.
    // A simple way to signal a reset is to have a parent component re-render this one with a new key.
    // Or, handle state reset more manually. Since formAction is now tied to useActionState,
    // we will create a new `initialState` to reset it.
    formAction(new FormData()); // Pass empty form data to reset
  }

  const enhancedFormAction = (formData: FormData) => {
    if (frames.length === 0 && !formData.has('frames')) {
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
  }

  useEffect(() => {
    if (!state || !state.key) return; // Don't run on initial state

    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Tespit Başarısız',
        description: state.error,
      });
    } else if (state.isBirthDetected) {
      toast({
        className: 'bg-success text-success-foreground',
        title: 'Doğum Tespit Edildi!',
        description: `Konum: ${selectedFeed}. Detaylar için sonucu inceleyin.`,
      });
    } else if (state.isBirthDetected === false) {
      toast({
        title: 'Analiz Tamamlandı',
        description: `Doğum tespit edilmedi.`,
      });
    }
  }, [state, toast, selectedFeed]);
  
  const selectedLocation = cameraFeeds.find(f => f.id === selectedFeed)?.location || 'Bilinmeyen Konum';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Kontrol Paneli</CardTitle>
                    <CardDescription>Analiz için bir kamera seçin ve bir video klip yükleyin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={enhancedFormAction} ref={formRef} className="space-y-4">
                        <input type="hidden" name="feedId" value={selectedFeed} />
                        
                        <div className="space-y-2">
                            <Label htmlFor="camera-select">Kamera Akışı</Label>
                            <Select onValueChange={(value) => {
                                resetState();
                                setSelectedFeed(value);
                            }} value={selectedFeed} required>
                                <SelectTrigger id="camera-select">
                                    <SelectValue placeholder="Bir kamera seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cameraFeeds.map(feed => (
                                        <SelectItem key={feed.id} value={feed.id}>{feed.location}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        

                        {selectedFeed && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="video-upload-birth">Video Klip</Label>
                                    <Input ref={fileInputRef} id="video-upload-birth" type="file" accept="video/*" onChange={handleFileChange} required />
                                    {videoFileName && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-2 pt-1">
                                        <FileVideo className="h-4 w-4" />
                                        <span>{videoFileName}</span>
                                        </div>
                                    )}
                                </div>

                                {videoFileName && (
                                    <div className="space-y-3">
                                        <video ref={videoRef} className="w-full rounded-md bg-black" controls muted playsInline />
                                        <Button type="button" variant="secondary" onClick={captureFrames} disabled={progress > 0 && progress < 100}>
                                            <Video className="mr-2"/>
                                            Kareleri Yakala
                                        </Button>
                                        {progress > 0 && <Progress value={progress} className="w-full" />}
                                        {frames.length > 0 && <p className="text-sm text-success">{frames.length} kare başarıyla yakalandı.</p>}
                                    </div>
                                )}
                                
                                {state?.error && (
                                <div className="flex items-center gap-x-2 text-sm text-destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p>{state.error}</p>
                                </div>
                                )}
                                <SubmitButton framesCaptured={frames.length > 0} />
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Analiz Sonucu</CardTitle>
                    <CardDescription>Doğum tespiti analizinin sonuçları burada görünecektir.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    {state?.evidence ? (
                        <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Tespit Tamamlandı</h3>
                        
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold">Konum:</p>
                            <Badge variant="outline">{selectedLocation}</Badge>
                        </div>

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

                        <Button onClick={resetState}>Yeni Analiz Başlat</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Camera className="w-12 h-12 mb-4" />
                            <p>Henüz bir analiz yapılmadı.</p>
                            <p className="text-sm">Lütfen bir kamera seçip videoyu analiz edin.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
