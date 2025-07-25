import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeedCard } from './video-feed-card';

const cameraFeeds = [
  {
    id: 'facility-1',
    location: 'Tesis 1 - Bölüm A',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'animal shelter',
  },
  {
    id: 'field-a',
    location: 'Açık Alan A',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'sheep pasture',
  },
  {
    id: 'nursery-1',
    location: 'Bakım Odası',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'puppies shelter',
  },
  {
    id: 'common-area',
    location: 'Ortak Alan',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cats shelter',
  },
];

type VideoFeedsProps = {
  onAnalyze: (location: string, anomaly: string) => void;
};

export function VideoFeeds({ onAnalyze }: VideoFeedsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Canlı Kamera Akışları</CardTitle>
        <CardDescription>Hayvanlarınızı gerçek zamanlı olarak izleyin ve davranışları analiz edin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cameraFeeds.map(feed => (
            <VideoFeedCard key={feed.id} {...feed} onAnalyze={onAnalyze} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
