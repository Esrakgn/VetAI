'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateAdvice } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  id: number;
  role: 'user' | 'model';
  content: string;
};

const initialState = {
  response: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      <Send />
    </Button>
  );
}

export function AiAssistantChat() {
  const [state, formAction] = useActionState(handleGenerateAdvice, initialState);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'model', content: "Merhaba! Ben Veteriner AI Asistanınız. Hayvanınızın sağlığı veya davranışıyla ilgili herhangi bir sorunuzda size yardımcı olmak için buradayım. Lütfen unutmayın, ben yalnızca bir yapay zeka asistanıyım ve acil durumlarda veya ciddi endişelerinizde gerçek bir veterinere danışmanız önemlidir. Size nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.response) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'model', content: state.response as string }]);
    }
    if (state.error) {
       setMessages(prev => [...prev, { id: Date.now(), role: 'model', content: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin." }]);
    }
  }, [state]);

   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = (formData: FormData) => {
    const question = formData.get('question') as string;
    if (!question.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    
    const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
    formData.append('chatHistory', JSON.stringify(chatHistory));

    formAction(formData);
    setInput('');
  };

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
                    {message.role === 'model' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex items-center gap-2"
        >
          <Input
            name="question"
            placeholder="Sorunuzu buraya yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
