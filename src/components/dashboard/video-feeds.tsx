import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeedCard } from './video-feed-card';

const cameraFeeds = [
  {
    id: 'barn-1',
    location: 'Ana Ahır - Bölüm 1',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cow barn',
  },
  {
    id: 'pasture-a',
    location: 'Mera A',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cow pasture',
  },
  {
    id: 'barn-2',
    location: 'Doğum Ahırı',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'calves barn',
  },
  {
    id: 'field-b',
    location: 'Batı Tarlası',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cows field',
  },
];

export function VideoFeeds() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Canlı Kamera Akışları</CardTitle>
        <CardDescription>Sürünüzü gerçek zamanlı olarak izleyin ve davranışları analiz edin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cameraFeeds.map(feed => (
            <VideoFeedCard key={feed.id} {...feed} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
