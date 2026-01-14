'use client';

import type { EventDetailData } from './eventData';
import { ArrowLeft, Calendar, Edit, MapPin, Trash2, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, getInitials, mockEventDetails } from './eventData';

type PageParams = {
  eventId: string;
};

export default function EventDetailPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const t = useTranslations('EventDetailPage');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the view param to preserve when navigating back
  const viewParam = searchParams.get('view');
  const backToClassesUrl = viewParam ? `/dashboard/classes?view=${viewParam}` : '/dashboard/classes';

  // Modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get event data (in real app, this would come from an API)
  const [eventData] = useState<EventDetailData | null>(
    mockEventDetails[resolvedParams.eventId] || null,
  );

  // Handler for deleting event
  const handleDeleteEvent = () => {
    // In a real app, this would call an API to delete the event
    router.push(backToClassesUrl);
  };

  if (!eventData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{t('not_found')}</p>
      </div>
    );
  }

  const isSingleDay = eventData.startDate === eventData.endDate;
  const dateDisplay = isSingleDay ? eventData.startDate : `${eventData.startDate} - ${eventData.endDate}`;
  const spotsRemaining = eventData.maxCapacity ? eventData.maxCapacity - eventData.currentRegistrations : null;

  return (
    <div className="w-full space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href={backToClassesUrl}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_classes')}
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <Badge variant="default" className="bg-primary text-primary-foreground">
            {t('event_badge')}
          </Badge>
          <Badge variant="outline">{eventData.eventType}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{eventData.name}</h1>
        <p className="text-lg text-muted-foreground">{eventData.description}</p>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('price_label')}</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(eventData.price)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('registrations_label')}</p>
          <p className="text-2xl font-bold text-foreground">{eventData.currentRegistrations}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('capacity_label')}</p>
          <p className="text-2xl font-bold text-foreground">
            {eventData.maxCapacity || t('unlimited')}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('spots_remaining_label')}</p>
          <p className={`text-2xl font-bold ${spotsRemaining && spotsRemaining < 5 ? 'text-destructive' : 'text-foreground'}`}>
            {spotsRemaining !== null ? spotsRemaining : t('unlimited')}
          </p>
        </Card>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Event Details + Pricing */}
        <div className="flex flex-col gap-6">
          {/* Event Details Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('details_card_title')}</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('dates_label')}</p>
                <p className="font-medium text-foreground">{dateDisplay}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('location_label')}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">{eventData.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('event_type_label')}</p>
                <p className="font-medium text-foreground">{eventData.eventType}</p>
              </div>
              {eventData.maxCapacity && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('max_capacity_label')}</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      {eventData.maxCapacity}
                      {' '}
                      {t('attendees')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('pricing_card_title')}</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t('regular_price_label')}</p>
                <p className="text-xl font-bold text-primary">{formatPrice(eventData.price)}</p>
              </div>
              {eventData.earlyBirdPrice && eventData.earlyBirdDeadline && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">{t('early_bird_label')}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {t('until')}
                        {' '}
                        {eventData.earlyBirdDeadline}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                      {formatPrice(eventData.earlyBirdPrice)}
                    </p>
                  </div>
                </div>
              )}
              {eventData.memberDiscount && eventData.memberDiscountType && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">{t('member_discount_label')}</p>
                  <p className="font-medium text-foreground">
                    {eventData.memberDiscountType === 'percentage'
                      ? `${eventData.memberDiscount}% ${t('off')}`
                      : `$${eventData.memberDiscount} ${t('off')}`}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sessions + Instructors */}
        <div className="flex flex-col gap-6">
          {/* Sessions Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('sessions_card_title')}</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {eventData.sessions.map((session, index) => (
                <div
                  key={`${session.date}-${session.time}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t('session_label')}
                      {' '}
                      {index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.date}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{session.time}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Instructors Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t('instructors_card_title')}</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            {eventData.instructors.length > 0
              ? (
                  <div className="space-y-3">
                    {eventData.instructors.map(instructor => (
                      <div key={instructor.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                          <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-foreground">{instructor.name}</p>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <p className="text-sm text-muted-foreground">{t('no_instructors')}</p>
                )}
          </Card>
        </div>
      </div>

      {/* Delete Button */}
      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('delete_button')}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_dialog_description', { eventName: eventData.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>
              {t('delete_confirm_button')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
