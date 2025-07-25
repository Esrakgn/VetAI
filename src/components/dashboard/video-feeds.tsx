import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeedCard } from './video-feed-card';

const cameraFeeds = [
  {
    id: 'barn-1',
    location: 'Main Barn - Section 1',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cow barn',
  },
  {
    id: 'pasture-a',
    location: 'Pasture A',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cow pasture',
  },
  {
    id: 'barn-2',
    location: 'Maternity Barn',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'calves barn',
  },
  {
    id: 'field-b',
    location: 'West Field',
    imageUrl: 'https://placehold.co/600x400',
    aiHint: 'cows field',
  },
];

export function VideoFeeds() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Live Camera Feeds</CardTitle>
        <CardDescription>Monitor your herd in real-time and analyze behavior.</CardDescription>
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
