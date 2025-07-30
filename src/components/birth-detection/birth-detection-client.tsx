'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
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
import { Loader2, AlertTriangle, FileVideo, CheckCircle, Video, PartyPopper, XCircle, Camera, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const cameraFeeds = [
  { id: 'facility-1', location: 'Tesis 1 - Bölüm A' },
  { id: 'field-a', location: 'Açık Alan A' },
  { id: 'nursery-1', location: 'Bakım Odası' },
  { id: 'common-area', location: 'Ortak Alan' },
];

const initialState = {
  isBirthDetected: null,
  estimatedBirthTime: null,
  keyFrame: null,
  evidence: null,
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [videoFileName, setVideoFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedFeed, setSelectedFeed] = useState<string>('');
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

    const result = await handleDetectBirth(initialState, formData);
    setAnalysisResult(result);
  };

  useEffect(() => {
    if (!analysisResult) return;

    if (analysisResult.error) {
      toast({
        variant: 'destructive',
        title: 'Tespit Başarısız',
        description: analysisResult.error,
      });
    } else if (analysisResult.isBirthDetected) {
      toast({
        className: 'bg-success text-success-foreground',
        title: 'Doğum Tespit Edildi!',
        description: `Konum: ${selectedFeed}. Detaylar için sonucu inceleyin.`,
      });
    } else if (analysisResult.isBirthDetected === false) {
      toast({
        title: 'Analiz Tamamlandı',
        description: `Doğum tespit edilmedi.`,
      });
    }
  }, [analysisResult, toast, selectedFeed]);
  
  const selectedLocation = cameraFeeds.find(f => f.id === selectedFeed)?.location || 'Bilinmeyen Konum';

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Kontrol Paneli</CardTitle>
                        <CardDescription>Analiz için bir kamera seçin ve bir video klip yükleyin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={passFramesToAction} ref={formRef} className="space-y-4">
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
                                    
                                    {analysisResult?.error && (
                                    <div className="flex items-center gap-x-2 text-sm text-destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <p>{analysisResult.error}</p>
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
                        {analysisResult?.evidence ? (
                            <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center text-primary"><CheckCircle className="mr-2 h-5 w-5" />Tespit Tamamlandı</h3>
                            
                            <div className="flex items-center space-x-2">
                                <p className="font-semibold">Konum:</p>
                                <Badge variant="outline">{selectedLocation}</Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                                <p className="font-semibold">Sonuç:</p>
                                {analysisResult.isBirthDetected ? (
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

                            {analysisResult.isBirthDetected && (
                                <div>
                                    <h4 className="font-semibold text-foreground">Tahmini Doğum Zamanı</h4>
                                    <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{analysisResult.estimatedBirthTime}</p>
                                </div>
                            )}
                            
                            <div>
                                <h4 className="font-semibold text-foreground">Kanıt</h4>
                                <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{analysisResult.evidence}</p>
                            </div>

                            {analysisResult.keyFrame && (
                                <div>
                                <h4 className="font-semibold text-foreground">Ekran Görüntüsü</h4>
                                <div className="mt-2 relative border rounded-md p-2">
                                    <Image src={analysisResult.keyFrame} alt="Doğum kanıtı" width={600} height={400} className="w-full h-auto rounded-md" />
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-primary"/>Kamera Yerleşimi İçin Öneriler</CardTitle>
                <CardDescription>Doğum tespiti özelliğinin doğru çalışabilmesi için kamera kurulumunun aşağıdaki şekilde yapılması önerilir:</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start">
                        <span className="mr-2">📍</span>
                        <span>Kamera, yeni doğan alanına veya doğum bölmesine bakacak şekilde yerleştirilmelidir.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🎯</span>
                        <span>Görüntü açısı, hayvanın yan profilden veya hafif üst açıdan tüm vücudunu görecek şekilde ayarlanmalıdır.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">💡</span>
                        <span>Geniş açılı (wide angle) kamera tercih edilmelidir; böylece zemindeki kan/sıvı izleri ve yavrunun doğum anı kolayca algılanır.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🌙</span>
                        <span>Gece görüş (IR) özelliği olan kameralar, düşük ışıklı ortamlarda bile doğru tespit yapılmasını sağlar.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🔧</span>
                        <span>Kamera yüksekliği genellikle 1.5 – 2 metre arası olmalı ve doğum alanını ortalayacak şekilde sabitlenmelidir.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🧼</span>
                        <span>Lensin doğum sırasında kirlenmemesi için mümkünse kamera koruma kutusu (housing) kullanılmalıdır.</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
