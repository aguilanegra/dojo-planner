'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EditLocationForm } from './EditLocationForm';

type LocationData = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
};

// Test data marker - for development/testing purposes only
const mockLocation: LocationData = {
  id: 'downtown-hq',
  name: 'Downtown HQ',
  address: '123 Main St. San Francisco. CA',
  phone: '(415) 555-0123',
  email: 'downtown@example.com',
};

type LocationCardProps = {
  isLoading?: boolean;
};

export function LocationCard({ isLoading = false }: LocationCardProps) {
  const t = useTranslations('LocationSettings');
  const tProfile = useTranslations('MyProfile');
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState<LocationData>(mockLocation);

  const handleSaveLocation = (data: {
    name: string;
    address: string;
    phone: string;
    email: string;
  }) => {
    setLocation(prev => ({
      ...prev,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
    }));
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-24" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-5 w-32" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground">{t('location_title')}</h3>

      {isEditing
        ? (
            <div className="mt-4">
              <EditLocationForm
                initialData={{
                  name: location.name,
                  address: location.address,
                  phone: location.phone,
                  email: location.email,
                }}
                onCancel={() => setIsEditing(false)}
                onSuccess={handleEditSuccess}
                onSave={handleSaveLocation}
              />
            </div>
          )
        : (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('address_label')}</label>
                  <p className="mt-1 text-foreground">{location.address || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('phone_label')}</label>
                  <p className="mt-1 text-foreground">{location.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('email_label')}</label>
                  <p className="mt-1 text-foreground">{location.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('status_label')}</label>
                  <p className="mt-1">
                    <Badge>{t('active_status')}</Badge>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit location information"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {tProfile('edit_button')}
                </Button>
              </div>
            </>
          )}
    </Card>
  );
}
