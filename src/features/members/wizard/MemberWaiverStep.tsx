'use client';

import type { AddMemberWizardData } from '@/hooks/useAddMemberWizard';
import type { WaiverTemplate } from '@/services/WaiversService';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SignatureCanvas } from '@/features/waivers/signing/SignatureCanvas';
import { client } from '@/libs/Orpc';

type SignerRelationship = 'self' | 'parent' | 'guardian' | 'legal_guardian';

type MemberWaiverStepProps = {
  data: AddMemberWizardData;
  onUpdate: (updates: Partial<AddMemberWizardData>) => void;
  onNext: () => void | Promise<void>;
  onBack: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  /** Member's date of birth for guardian check */
  memberDateOfBirth?: Date;
};

/**
 * Calculate age from date of birth
 */
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function MemberWaiverStep({
  data,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  isLoading = false,
  memberDateOfBirth,
}: MemberWaiverStepProps) {
  const t = useTranslations('MemberWaiverStep');

  const [waiver, setWaiver] = useState<WaiverTemplate | null>(null);
  const [resolvedContent, setResolvedContent] = useState<string>('');
  const [isFetchingWaiver, setIsFetchingWaiver] = useState(true);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(data.waiverSignatureDataUrl ?? null);
  const [signerName, setSignerName] = useState(data.waiverSignedByName ?? '');
  const [signerRelationship, setSignerRelationship] = useState<SignerRelationship>(
    data.waiverSignedByRelationship ?? 'self',
  );
  const [guardianEmail, setGuardianEmail] = useState(data.waiverGuardianEmail ?? '');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    signature?: string;
    signerName?: string;
    agreement?: string;
  }>({});

  // Calculate if guardian signature is required
  const memberAge = useMemo(() => {
    if (!memberDateOfBirth) {
      return null;
    }
    return calculateAge(memberDateOfBirth);
  }, [memberDateOfBirth]);

  const requiresGuardian = useMemo(() => {
    if (!waiver || memberAge === null) {
      return false;
    }
    return waiver.requiresGuardian && memberAge < waiver.guardianAgeThreshold;
  }, [waiver, memberAge]);

  // Fetch waiver for selected membership plan
  useEffect(() => {
    const fetchWaiver = async () => {
      if (!data.membershipPlanId) {
        setIsFetchingWaiver(false);
        return;
      }

      setIsFetchingWaiver(true);
      try {
        // Get waivers associated with the selected membership plan
        const result = await client.waivers.getWaiversForMembership({
          membershipPlanId: data.membershipPlanId,
        });

        // Use the first active waiver
        const activeWaivers = result.waivers.filter(w => w.isActive);
        if (activeWaivers.length > 0) {
          const selectedWaiver = activeWaivers[0]!;
          setWaiver(selectedWaiver);

          // Resolve placeholders
          const resolved = await client.waivers.resolvePlaceholders({
            templateId: selectedWaiver.id,
          });
          setResolvedContent(resolved.resolvedContent);

          // Update data with waiver template ID
          onUpdate({ waiverTemplateId: selectedWaiver.id });
        } else {
          // No waiver required for this membership
          setWaiver(null);
        }
      } catch (error) {
        console.error('Failed to fetch waiver:', error);
        setWaiver(null);
      } finally {
        setIsFetchingWaiver(false);
      }
    };

    fetchWaiver();
  }, [data.membershipPlanId, onUpdate]);

  // Auto-advance if no waiver is required
  useEffect(() => {
    if (!isFetchingWaiver && !waiver) {
      // Clear any waiver data and proceed to next step
      onUpdate({
        waiverTemplateId: null,
        waiverSignatureDataUrl: undefined,
        waiverSignedByName: undefined,
        waiverSignedByRelationship: undefined,
        waiverGuardianEmail: undefined,
        waiverSkipped: true,
      });
      onNext();
    }
  }, [isFetchingWaiver, waiver, onUpdate, onNext]);

  const handleSignatureChange = useCallback((dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
    setErrors(prev => ({ ...prev, signature: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (!signatureDataUrl) {
      newErrors.signature = t('signature_required_error');
    }

    if (!signerName.trim()) {
      newErrors.signerName = t('name_required_error');
    }

    if (!hasAgreed) {
      newErrors.agreement = t('agreement_required_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [signatureDataUrl, signerName, hasAgreed, t]);

  const handleNext = useCallback(async () => {
    if (!validate()) {
      return;
    }

    // Update wizard data with waiver signature info
    onUpdate({
      waiverSignatureDataUrl: signatureDataUrl!,
      waiverSignedByName: signerName,
      waiverSignedByRelationship: requiresGuardian ? signerRelationship : 'self',
      waiverGuardianEmail: requiresGuardian ? guardianEmail : undefined,
      waiverSignedAt: new Date(),
      waiverSkipped: false,
      waiverRenderedContent: resolvedContent,
    });

    await onNext();
  }, [
    validate,
    onUpdate,
    onNext,
    signatureDataUrl,
    signerName,
    signerRelationship,
    guardianEmail,
    requiresGuardian,
    resolvedContent,
  ]);

  // Show loading state while fetching waiver
  if (isFetchingWaiver) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t('loading_waiver')}</p>
      </div>
    );
  }

  // If no waiver needed, component auto-advances (see useEffect above)
  if (!waiver) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Guardian required alert */}
      {requiresGuardian && (
        <Alert variant="warning">
          <strong>{t('guardian_required_title')}</strong>
          {' '}
          {t('guardian_required_message', { age: waiver.guardianAgeThreshold })}
        </Alert>
      )}

      {/* Waiver content */}
      <div className="max-h-64 overflow-y-auto rounded-lg border bg-muted/30 p-4">
        <div className="max-w-none text-sm whitespace-pre-wrap">
          {resolvedContent}
        </div>
      </div>

      {/* Guardian/signer information (if required) */}
      {requiresGuardian && (
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">{t('guardian_info_title')}</h3>

          <div className="space-y-2">
            <Label htmlFor="relationship">{t('relationship_label')}</Label>
            <Select
              value={signerRelationship}
              onValueChange={value => setSignerRelationship(value as SignerRelationship)}
            >
              <SelectTrigger id="relationship">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">{t('relationship_parent')}</SelectItem>
                <SelectItem value="guardian">{t('relationship_guardian')}</SelectItem>
                <SelectItem value="legal_guardian">{t('relationship_legal_guardian')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian-email">{t('guardian_email_label')}</Label>
            <Input
              id="guardian-email"
              type="email"
              placeholder={t('guardian_email_placeholder')}
              value={guardianEmail}
              onChange={e => setGuardianEmail(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Signer name */}
      <div className="space-y-2">
        <Label htmlFor="signer-name">{t('signer_name_label')}</Label>
        <Input
          id="signer-name"
          placeholder={t('signer_name_placeholder')}
          value={signerName}
          onChange={(e) => {
            setSignerName(e.target.value);
            setErrors(prev => ({ ...prev, signerName: undefined }));
          }}
        />
        {errors.signerName && (
          <p className="text-sm text-destructive">{errors.signerName}</p>
        )}
      </div>

      {/* Signature canvas */}
      <SignatureCanvas
        label={t('signature_label')}
        onSignatureChange={handleSignatureChange}
        error={errors.signature}
      />

      {/* Agreement checkbox */}
      <div className="flex items-start gap-2">
        <Checkbox
          id="agreement"
          checked={hasAgreed}
          onCheckedChange={(checked) => {
            setHasAgreed(checked === true);
            setErrors(prev => ({ ...prev, agreement: undefined }));
          }}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="agreement"
            className="cursor-pointer text-sm leading-relaxed font-normal"
          >
            {t('agree_checkbox')}
          </Label>
          {errors.agreement && (
            <p className="text-sm text-destructive">{errors.agreement}</p>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t('back_button')}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel_button')}
          </Button>
        </div>
        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? `${t('continue_button')}...` : t('continue_button')}
        </Button>
      </div>
    </div>
  );
}
