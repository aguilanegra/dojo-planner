'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotificationButton = () => {
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" title="Notifications">
        <Bell className="h-5 w-5" />
        <span className="sr-only">View notifications</span>
      </Button>
      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
    </div>
  );
};
