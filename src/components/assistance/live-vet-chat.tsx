'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Stethoscope, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

type MockMessage = {
  id: number;
  role: 'user' | 'vet';
  content: string;
  name: string;
};

const mockConversation: Omit<MockMessage, 'id'>[] = [
    { role: 'vet', name: 'Dr. Elif', content: "Merhaba, ben Dr. Elif. Size nasıl yardımcı olabilirim?" },
    { role: 'user', name: 'Siz', content: "Merhaba doktor, köpeğim son birkaç gündür çok halsiz ve iştahı yok." },
    { role: 'vet', name: 'Dr. Elif', content: "Anlıyorum. Ateş, kusma veya ishal gibi başka belirtiler fark ettiniz mi?" },
    { role: 'user', name: 'Siz', content: "Ateşini ölçmedim ama dün biraz kusmuştu." },
    { role: 'vet', name: 'Dr. Elif', content: "Tamamdır. Lütfen köpeğinizin bir fotoğrafını ve mümkünse diş etlerinin bir fotoğrafını yükleyebilir misiniz? Bu, durumu daha iyi değerlendirmeme yardımcı olacaktır." },
];

export function LiveVetChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2500);
  };
  
   useEffect(() => {
    if (isConnected) {
      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex < mockConversation.length) {
          setMessages(prev => [...prev, { ...mockConversation[messageIndex], id: Date.now() + messageIndex }]);
          messageIndex++;
        } else {
          clearInterval(interval);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isConnected]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);


  if (!isConnected && !isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Stethoscope className="w-16 h-16 mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">Canlı Veteriner Desteği</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">Acil durumlar veya ikinci bir görüş için bir uzman veterinerle canlı görüşme başlatın.</p>
        <Button onClick={handleConnect}>
          Canlı Görüşme Başlat
        </Button>
      </div>
    );
  }

  if (isConnecting) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Uzmana Bağlanılıyor...</h2>
            <p className="text-muted-foreground">Lütfen bekleyin, sizi uygun ilk veterinere bağlıyoruz.</p>
        </div>
      )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow p-4 flex flex-col">
        <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
             <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'vet' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Stethoscope /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className={`text-xs text-muted-foreground ${message.role === 'user' ? 'text-right' : ''}`}>{message.name}</span>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground text-center w-full">Bu, canlı sohbetin bir simülasyonudur.</p>
        </div>
      </CardContent>
    </Card>
  );
}
