'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export function ProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Fotoğrafı</CardTitle>
        <CardDescription>Profil fotoğrafınızı güncelleyebilirsiniz.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://placehold.co/100x100" alt="User Avatar" />
            <AvatarFallback>VA</AvatarFallback>
          </Avatar>
          <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <div className="font-semibold">
          <p className="text-lg">Vet AI Kullanıcısı</p>
          <p className="text-sm text-muted-foreground">user@vetai.com</p>
        </div>
      </CardContent>
    </Card>
  );
}
