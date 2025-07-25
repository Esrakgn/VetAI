"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnalysisDialog } from './analysis-dialog';
import { Bot } from 'lucide-react';

type VideoFeedCardProps = {
  id: string;
  location: string;
  imageUrl: string;
  aiHint: string;
};

export function VideoFeedCard({ id, location, imageUrl, aiHint }: VideoFeedCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <Image
          src={imageUrl}
          alt={`Live feed from ${location}`}
          width={600}
          height={400}
          data-ai-hint={aiHint}
          className="object-cover w-full h-full aspect-video"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
          <p className="text-sm font-semibold text-primary-foreground">{location}</p>
          <Button size="sm" onClick={() => setIsDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Bot className="mr-2 h-4 w-4" />
            Analyze
          </Button>
        </div>
      </div>
      <AnalysisDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={location}
        feedId={id}
      />
    </>
  );
}
