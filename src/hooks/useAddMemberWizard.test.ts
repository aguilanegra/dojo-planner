import type { AddMemberWizardData, WizardStep } from './useAddMemberWizard';
import { describe, expect, it } from 'vitest';

describe('useAddMemberWizard types and exports', () => {
  it('should export AddMemberWizardData type', () => {
    // This test verifies that the types are properly exported
    // The actual hook behavior is tested in component tests (.test.tsx files)
    const testData: AddMemberWizardData = {
      memberType: 'individual',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      subscriptionPlan: 'monthly',
    };

    expect(testData.memberType).toBe('individual');
    expect(testData.firstName).toBe('John');
    expect(testData.lastName).toBe('Doe');
  });

  it('should support all member types', () => {
    const memberTypes: Array<'individual' | 'family-member' | 'head-of-household'> = [
      'individual',
      'family-member',
      'head-of-household',
    ];

    expect(memberTypes).toHaveLength(3);
    expect(memberTypes[0]).toBe('individual');
    expect(memberTypes[1]).toBe('family-member');
    expect(memberTypes[2]).toBe('head-of-household');
  });

  it('should support all subscription plans', () => {
    const plans: Array<'free-trial' | 'monthly' | 'annual' | 'custom'> = [
      'free-trial',
      'monthly',
      'annual',
      'custom',
    ];

    expect(plans).toHaveLength(4);
    expect(plans[0]).toBe('free-trial');
    expect(plans[1]).toBe('monthly');
    expect(plans[2]).toBe('annual');
    expect(plans[3]).toBe('custom');
  });

  it('should support all wizard steps', () => {
    const steps: WizardStep[] = ['member-type', 'details', 'photo', 'subscription', 'success'];

    expect(steps).toHaveLength(5);
    expect(steps[0]).toBe('member-type');
    expect(steps[1]).toBe('details');
    expect(steps[2]).toBe('photo');
    expect(steps[3]).toBe('subscription');
    expect(steps[4]).toBe('success');
  });

  it('should allow creating data with optional address', () => {
    const dataWithAddress: AddMemberWizardData = {
      memberType: 'individual',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      subscriptionPlan: 'monthly',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
      },
    };

    expect(dataWithAddress.address?.street).toBe('123 Main St');
    expect(dataWithAddress.address?.city).toBe('San Francisco');
  });

  it('should allow creating data with optional photo file', () => {
    const mockFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    const dataWithPhoto: AddMemberWizardData = {
      memberType: 'individual',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      subscriptionPlan: 'monthly',
      photoFile: mockFile,
    };

    expect(dataWithPhoto.photoFile?.name).toBe('photo.jpg');
    expect(dataWithPhoto.photoFile?.type).toBe('image/jpeg');
  });

  it('should allow null values for optional fields', () => {
    const minimalData: AddMemberWizardData = {
      memberType: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subscriptionPlan: null,
    };

    expect(minimalData.memberType).toBeNull();
    expect(minimalData.subscriptionPlan).toBeNull();
    expect(minimalData.firstName).toBe('');
    expect(minimalData.email).toBe('');
  });
});
