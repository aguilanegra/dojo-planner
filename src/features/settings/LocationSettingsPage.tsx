'use client';

import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EditLocationModal } from './EditLocationModal';

type LocationData = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
};

const mockLocation: LocationData = {
  id: 'downtown-hq',
  name: 'Downtown HQ',
  address: '123 Main St. San Francisco. CA',
  phone: '(415) 555-0123',
  email: 'downtown@example.com',
};

export function LocationSettingsPage() {
  const t = useTranslations('LocationSettings');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Location Information Card */}
      <Card className="relative p-6">
        <h3 className="text-lg font-semibold text-foreground">{t('location_title')}</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">{t('address_label')}</label>
            <p className="mt-1 text-foreground">{location.address}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t('phone_label')}</label>
            <p className="mt-1 text-foreground">{location.phone}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t('email_label')}</label>
            <p className="mt-1 text-foreground">{location.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t('status_label')}</label>
            <p className="mt-1">
              <Badge>{t('active_status')}</Badge>
            </p>
          </div>
        </div>

        {/* Edit Button - Bottom Right */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            aria-label="Edit location information"
            title="Edit location information"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Edit Location Modal */}
      <EditLocationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        name={location.name}
        address={location.address}
        phone={location.phone}
        email={location.email}
        onSave={handleSaveLocation}
      />
    </div>
  );
}
