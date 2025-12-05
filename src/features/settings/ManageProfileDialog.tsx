'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PasswordInput } from '@/components/ui/input/password-input';
import { Label } from '@/components/ui/label';

const mockUser = {
  firstName: 'Anika',
  lastName: 'Green',
  email: 'agreen@gmail.com',
  phone: '(415) 223-4123',
  role: 'Account Owner',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
};

type ManageProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ManageProfileDialog({ open, onOpenChange }: ManageProfileDialogProps) {
  const tDialog = useTranslations('ManageProfileDialog');
  const tProfile = useTranslations('MyProfile');
  const tSecurity = useTranslations('Security');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tDialog('title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                {tProfile('edit_button')}
              </Button>
            </div>

            {/* User Details Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{tProfile('first_name_label')}</label>
                <p className="mt-1 text-foreground">{mockUser.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{tProfile('last_name_label')}</label>
                <p className="mt-1 text-foreground">{mockUser.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{tProfile('phone_label')}</label>
                <p className="mt-1 text-foreground">{mockUser.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{tProfile('email_label')}</label>
                <p className="mt-1 text-foreground">{mockUser.email}</p>
              </div>
            </div>
          </Card>

          {/* Change Password Section */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{tSecurity('change_password_title')}</h2>
              </div>
              {!showPasswordForm && (
                <Button onClick={() => setShowPasswordForm(true)}>
                  {tSecurity('change_password_button')}
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="current-password">{tSecurity('current_password_label')}</Label>
                  <PasswordInput
                    id="current-password"
                    placeholder={tSecurity('current_password_placeholder')}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">{tSecurity('new_password_label')}</Label>
                  <PasswordInput
                    id="new-password"
                    placeholder={tSecurity('new_password_placeholder')}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">{tSecurity('confirm_password_label')}</Label>
                  <PasswordInput
                    id="confirm-password"
                    placeholder={tSecurity('confirm_password_placeholder')}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button>{tSecurity('save_button')}</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    {tSecurity('cancel_button')}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Two-Factor Authentication Section */}
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{tSecurity('two_factor_title')}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{tSecurity('two_factor_description')}</p>
              </div>
              <Button>{tSecurity('add_2fa_button')}</Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
