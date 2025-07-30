"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnalysisDialog } from './analysis-dialog';
import { BirthDetectionDialog } from './birth-detection-dialog';
import { Bot, Baby } from 'lucide-react';

type VideoFeedCardProps = {
  id: string;
  location: string;
  imageUrl: string;
  aiHint: string;
  onAnalyze: (location: string, anomaly: string) => void;
};

export function VideoFeedCard({ id, location, imageUrl, aiHint, onAnalyze }: VideoFeedCardProps) {
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [isBirthDialogOpen, setIsBirthDialogOpen] = useState(false);

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
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsBirthDialogOpen(true)} className="bg-pink-500 text-white hover:bg-pink-600">
              <Baby className="mr-2 h-4 w-4" />
              Doğum Tespiti
            </Button>
            <Button size="sm" onClick={() => setIsAnalysisDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Bot className="mr-2 h-4 w-4" />
              Analiz Et
            </Button>
          </div>
        </div>
      </div>
      <AnalysisDialog
        open={isAnalysisDialogOpen}
        onOpenChange={setIsAnalysisDialogOpen}
        location={location}
        feedId={id}
        onAnalyze={onAnalyze}
      />
      <BirthDetectionDialog
        open={isBirthDialogOpen}
        onOpenChange={setIsBirthDialogOpen}
        location={location}
        feedId={id}
      />
    </>
  );
}
