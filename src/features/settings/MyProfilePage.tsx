'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const mockUser = {
  firstName: 'Anika',
  lastName: 'Green',
  email: 'agreen@gmail.com',
  phone: '(415) 223-4123',
  role: 'Account Owner',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
};

export function MyProfilePage() {
  const t = useTranslations('MyProfile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* User Info */}
          <div className="flex gap-6">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={mockUser.photoUrl} alt={`${mockUser.firstName} ${mockUser.lastName}`} />
              <AvatarFallback>
                {mockUser.firstName[0]}
                {mockUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                {mockUser.firstName}
                {' '}
                {mockUser.lastName}
              </h2>
              <Badge variant="outline" className="w-fit">
                {mockUser.role}
              </Badge>
            </div>
          </div>

          {/* Edit Button */}
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            {t('edit_button')}
          </Button>
        </div>

        {/* User Details Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('first_name_label')}</label>
            <p className="mt-1 text-foreground">{mockUser.firstName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('last_name_label')}</label>
            <p className="mt-1 text-foreground">{mockUser.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('phone_label')}</label>
            <p className="mt-1 text-foreground">{mockUser.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t('email_label')}</label>
            <p className="mt-1 text-foreground">{mockUser.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
