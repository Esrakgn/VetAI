'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AiAssistantChat } from './ai-assistant-chat';
import { LiveVetChat } from './live-vet-chat';
import { Bot, User, MessageCircle } from 'lucide-react';

export function AssistanceChat() {
  const [chatMode, setChatMode] = useState<'ai' | 'live'>('ai');

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex border-b mb-4">
        <Button
          variant="ghost"
          onClick={() => setChatMode('ai')}
          className={`rounded-b-none ${chatMode === 'ai' ? 'border-b-2 border-primary' : ''}`}
        >
          <Bot className="mr-2" />
          Yapay Zeka Asistanı
        </Button>
        <Button
          variant="ghost"
          onClick={() => setChatMode('live')}
          className={`rounded-b-none ${chatMode === 'live' ? 'border-b-2 border-primary' : ''}`}
        >
          <User className="mr-2" />
          Canlı Veteriner
        </Button>
      </div>

      <div className="flex-grow">
        {chatMode === 'ai' ? <AiAssistantChat /> : <LiveVetChat />}
      </div>
    </div>
  );
}
