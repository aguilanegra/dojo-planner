import { describe, expect, it } from 'vitest';
import {
  AddWaiverToMembershipValidation,
  CreateMergeFieldValidation,
  CreateSignedWaiverValidation,
  CreateWaiverTemplateValidation,
  DeleteMergeFieldValidation,
  DeleteWaiverTemplateValidation,
  GetSignedWaiverValidation,
  GetTemplateVersionValidation,
  GetWaiversForMembershipValidation,
  GetWaiverTemplateValidation,
  ListMemberSignedWaiversValidation,
  ListTemplateVersionsValidation,
  RemoveWaiverFromMembershipValidation,
  ResolveWaiverPlaceholdersValidation,
  SetMembershipWaiversValidation,
  UpdateMergeFieldValidation,
  UpdateWaiverTemplateValidation,
} from './WaiverValidation';

const validContent = 'a'.repeat(100);

describe('WaiverValidation', () => {
  // ===========================================================================
  // WAIVER TEMPLATE VALIDATIONS
  // ===========================================================================

  describe('CreateWaiverTemplateValidation', () => {
    const validTemplate = {
      name: 'Liability Waiver',
      content: validContent,
    };

    it('should accept valid data with minimal fields', () => {
      const result = CreateWaiverTemplateValidation.safeParse(validTemplate);

      expect(result.success).toBe(true);
    });

    it('should accept valid data with all fields', () => {
      const completeTemplate = {
        ...validTemplate,
        description: 'Standard liability waiver for all members',
        isActive: false,
        isDefault: true,
        requiresGuardian: false,
        guardianAgeThreshold: 18,
      };
      const result = CreateWaiverTemplateValidation.safeParse(completeTemplate);

      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        name: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        content: validContent,
      });

      expect(result.success).toBe(false);
    });

    it('should reject name exceeding 100 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        name: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it('should accept name at exactly 100 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        name: 'a'.repeat(100),
      });

      expect(result.success).toBe(true);
    });

    it('should reject content shorter than 100 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        content: 'a'.repeat(99),
      });

      expect(result.success).toBe(false);
    });

    it('should accept content at exactly 100 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        content: 'a'.repeat(100),
      });

      expect(result.success).toBe(true);
    });

    it('should reject content exceeding 50000 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        content: 'a'.repeat(50001),
      });

      expect(result.success).toBe(false);
    });

    it('should accept content at exactly 50000 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        content: 'a'.repeat(50000),
      });

      expect(result.success).toBe(true);
    });

    it('should reject missing content', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        name: 'Liability Waiver',
      });

      expect(result.success).toBe(false);
    });

    it('should apply default values', () => {
      const result = CreateWaiverTemplateValidation.safeParse(validTemplate);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isActive).toBe(true);
        expect(result.data.isDefault).toBe(false);
        expect(result.data.requiresGuardian).toBe(true);
        expect(result.data.guardianAgeThreshold).toBe(16);
      }
    });

    it('should allow overriding default values', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        isActive: false,
        isDefault: true,
        requiresGuardian: false,
        guardianAgeThreshold: 18,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isActive).toBe(false);
        expect(result.data.isDefault).toBe(true);
        expect(result.data.requiresGuardian).toBe(false);
        expect(result.data.guardianAgeThreshold).toBe(18);
      }
    });

    it('should reject guardianAgeThreshold below 13', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        guardianAgeThreshold: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should accept guardianAgeThreshold at exactly 13', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        guardianAgeThreshold: 13,
      });

      expect(result.success).toBe(true);
    });

    it('should reject guardianAgeThreshold above 21', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        guardianAgeThreshold: 22,
      });

      expect(result.success).toBe(false);
    });

    it('should accept guardianAgeThreshold at exactly 21', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        guardianAgeThreshold: 21,
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional description', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        description: 'A description',
      });

      expect(result.success).toBe(true);
    });

    it('should reject description exceeding 500 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        description: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should accept description at exactly 500 characters', () => {
      const result = CreateWaiverTemplateValidation.safeParse({
        ...validTemplate,
        description: 'a'.repeat(500),
      });

      expect(result.success).toBe(true);
    });
  });

  describe('UpdateWaiverTemplateValidation', () => {
    it('should validate with only id', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({ id: 'template-123' });

      expect(result.success).toBe(true);
    });

    it('should require id', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({ name: 'Updated Name' });

      expect(result.success).toBe(false);
    });

    it('should accept partial update with only name', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        name: 'Updated Waiver',
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only content', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        content: validContent,
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only isActive', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only isDefault', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        isDefault: true,
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only requiresGuardian', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        requiresGuardian: false,
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only guardianAgeThreshold', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        guardianAgeThreshold: 18,
      });

      expect(result.success).toBe(true);
    });

    it('should accept nullable description', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        description: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept string description', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        description: 'Updated description',
      });

      expect(result.success).toBe(true);
    });

    it('should reject content shorter than 100 characters', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        content: 'too short',
      });

      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 50000 characters', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        content: 'a'.repeat(50001),
      });

      expect(result.success).toBe(false);
    });

    it('should reject name exceeding 100 characters', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        name: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        name: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject guardianAgeThreshold below 13', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        guardianAgeThreshold: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should reject guardianAgeThreshold above 21', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        guardianAgeThreshold: 22,
      });

      expect(result.success).toBe(false);
    });

    it('should reject description exceeding 500 characters', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        description: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should validate with all optional fields', () => {
      const result = UpdateWaiverTemplateValidation.safeParse({
        id: 'template-123',
        name: 'Updated Waiver',
        content: validContent,
        description: 'Updated description',
        isActive: false,
        isDefault: true,
        requiresGuardian: false,
        guardianAgeThreshold: 18,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DeleteWaiverTemplateValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteWaiverTemplateValidation.safeParse({ id: 'template-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = DeleteWaiverTemplateValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe('GetWaiverTemplateValidation', () => {
    it('should validate with valid id', () => {
      const result = GetWaiverTemplateValidation.safeParse({ id: 'template-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = GetWaiverTemplateValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  // ===========================================================================
  // SIGNED WAIVER VALIDATIONS
  // ===========================================================================

  describe('CreateSignedWaiverValidation', () => {
    const validSignedWaiver = {
      waiverTemplateId: 'template-123',
      memberId: 'member-456',
      signatureDataUrl: 'data:image/png;base64,abc123',
      signedByName: 'John Doe',
      memberFirstName: 'John',
      memberLastName: 'Doe',
      memberEmail: 'john@example.com',
      renderedContent: 'This is the rendered waiver content for the member to sign.',
    };

    it('should accept valid data with minimal fields', () => {
      const result = CreateSignedWaiverValidation.safeParse(validSignedWaiver);

      expect(result.success).toBe(true);
    });

    it('should accept valid data with all fields', () => {
      const completeSignedWaiver = {
        ...validSignedWaiver,
        memberMembershipId: 'membership-789',
        signedByEmail: 'parent@example.com',
        signedByRelationship: 'parent' as const,
        memberDateOfBirth: '2010-01-15',
        memberAgeAtSigning: 14,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };
      const result = CreateSignedWaiverValidation.safeParse(completeSignedWaiver);

      expect(result.success).toBe(true);
    });

    it('should reject missing waiverTemplateId', () => {
      const { waiverTemplateId: _, ...withoutTemplateId } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutTemplateId);

      expect(result.success).toBe(false);
    });

    it('should reject missing memberId', () => {
      const { memberId: _, ...withoutMemberId } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutMemberId);

      expect(result.success).toBe(false);
    });

    it('should reject missing signatureDataUrl', () => {
      const { signatureDataUrl: _, ...withoutSignature } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutSignature);

      expect(result.success).toBe(false);
    });

    it('should reject empty signatureDataUrl', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signatureDataUrl: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing signedByName', () => {
      const { signedByName: _, ...withoutSignerName } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutSignerName);

      expect(result.success).toBe(false);
    });

    it('should reject empty signedByName', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signedByName: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject signedByName exceeding 100 characters', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signedByName: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing memberFirstName', () => {
      const { memberFirstName: _, ...withoutFirstName } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutFirstName);

      expect(result.success).toBe(false);
    });

    it('should reject empty memberFirstName', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberFirstName: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing memberLastName', () => {
      const { memberLastName: _, ...withoutLastName } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutLastName);

      expect(result.success).toBe(false);
    });

    it('should reject empty memberLastName', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberLastName: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing memberEmail', () => {
      const { memberEmail: _, ...withoutEmail } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutEmail);

      expect(result.success).toBe(false);
    });

    it('should reject invalid memberEmail', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberEmail: 'not-an-email',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing renderedContent', () => {
      const { renderedContent: _, ...withoutContent } = validSignedWaiver;
      const result = CreateSignedWaiverValidation.safeParse(withoutContent);

      expect(result.success).toBe(false);
    });

    it('should reject empty renderedContent', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        renderedContent: '',
      });

      expect(result.success).toBe(false);
    });

    it('should accept valid signedByRelationship values', () => {
      const relationships = ['self', 'parent', 'guardian', 'legal_guardian'] as const;
      for (const relationship of relationships) {
        const result = CreateSignedWaiverValidation.safeParse({
          ...validSignedWaiver,
          signedByRelationship: relationship,
        });

        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid signedByRelationship', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signedByRelationship: 'friend',
      });

      expect(result.success).toBe(false);
    });

    it('should accept optional signedByEmail', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signedByEmail: 'parent@example.com',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid signedByEmail', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        signedByEmail: 'not-an-email',
      });

      expect(result.success).toBe(false);
    });

    it('should accept optional memberMembershipId', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberMembershipId: 'membership-789',
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional memberDateOfBirth as date-coercible string', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberDateOfBirth: '2010-06-15',
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional memberAgeAtSigning', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        memberAgeAtSigning: 16,
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional ipAddress', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        ipAddress: '10.0.0.1',
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional userAgent', () => {
      const result = CreateSignedWaiverValidation.safeParse({
        ...validSignedWaiver,
        userAgent: 'Mozilla/5.0 (Macintosh)',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('GetSignedWaiverValidation', () => {
    it('should validate with valid id', () => {
      const result = GetSignedWaiverValidation.safeParse({ id: 'signed-waiver-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = GetSignedWaiverValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe('ListMemberSignedWaiversValidation', () => {
    it('should validate with valid memberId', () => {
      const result = ListMemberSignedWaiversValidation.safeParse({ memberId: 'member-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing memberId', () => {
      const result = ListMemberSignedWaiversValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  // ===========================================================================
  // MEMBERSHIP-WAIVER ASSOCIATION VALIDATIONS
  // ===========================================================================

  describe('GetWaiversForMembershipValidation', () => {
    it('should validate with valid membershipPlanId', () => {
      const result = GetWaiversForMembershipValidation.safeParse({ membershipPlanId: 'plan-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing membershipPlanId', () => {
      const result = GetWaiversForMembershipValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe('SetMembershipWaiversValidation', () => {
    it('should accept valid data with array of template IDs', () => {
      const result = SetMembershipWaiversValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateIds: ['template-1', 'template-2', 'template-3'],
      });

      expect(result.success).toBe(true);
    });

    it('should accept empty array of template IDs', () => {
      const result = SetMembershipWaiversValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateIds: [],
      });

      expect(result.success).toBe(true);
    });

    it('should reject missing membershipPlanId', () => {
      const result = SetMembershipWaiversValidation.safeParse({
        waiverTemplateIds: ['template-1'],
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing waiverTemplateIds', () => {
      const result = SetMembershipWaiversValidation.safeParse({
        membershipPlanId: 'plan-123',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('AddWaiverToMembershipValidation', () => {
    it('should accept valid data', () => {
      const result = AddWaiverToMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateId: 'template-456',
      });

      expect(result.success).toBe(true);
    });

    it('should apply default isRequired of true', () => {
      const result = AddWaiverToMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateId: 'template-456',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isRequired).toBe(true);
      }
    });

    it('should allow overriding isRequired to false', () => {
      const result = AddWaiverToMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateId: 'template-456',
        isRequired: false,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isRequired).toBe(false);
      }
    });

    it('should reject missing membershipPlanId', () => {
      const result = AddWaiverToMembershipValidation.safeParse({
        waiverTemplateId: 'template-456',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing waiverTemplateId', () => {
      const result = AddWaiverToMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('RemoveWaiverFromMembershipValidation', () => {
    it('should accept valid data', () => {
      const result = RemoveWaiverFromMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
        waiverTemplateId: 'template-456',
      });

      expect(result.success).toBe(true);
    });

    it('should reject missing membershipPlanId', () => {
      const result = RemoveWaiverFromMembershipValidation.safeParse({
        waiverTemplateId: 'template-456',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing waiverTemplateId', () => {
      const result = RemoveWaiverFromMembershipValidation.safeParse({
        membershipPlanId: 'plan-123',
      });

      expect(result.success).toBe(false);
    });
  });

  // ===========================================================================
  // PLACEHOLDER RESOLUTION VALIDATION
  // ===========================================================================

  describe('ResolveWaiverPlaceholdersValidation', () => {
    it('should accept valid data with templateId only', () => {
      const result = ResolveWaiverPlaceholdersValidation.safeParse({
        templateId: 'template-123',
      });

      expect(result.success).toBe(true);
    });

    it('should require templateId', () => {
      const result = ResolveWaiverPlaceholdersValidation.safeParse({});

      expect(result.success).toBe(false);
    });

    it('should accept optional overrides as a record of strings', () => {
      const result = ResolveWaiverPlaceholdersValidation.safeParse({
        templateId: 'template-123',
        overrides: {
          organization_name: 'Test Dojo',
          location: '123 Main St',
        },
      });

      expect(result.success).toBe(true);
    });

    it('should accept empty overrides object', () => {
      const result = ResolveWaiverPlaceholdersValidation.safeParse({
        templateId: 'template-123',
        overrides: {},
      });

      expect(result.success).toBe(true);
    });

    it('should accept without overrides field', () => {
      const result = ResolveWaiverPlaceholdersValidation.safeParse({
        templateId: 'template-123',
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.overrides).toBeUndefined();
      }
    });
  });

  // ===========================================================================
  // VERSION HISTORY VALIDATIONS
  // ===========================================================================

  describe('ListTemplateVersionsValidation', () => {
    it('should validate with valid id', () => {
      const result = ListTemplateVersionsValidation.safeParse({ id: 'template-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = ListTemplateVersionsValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe('GetTemplateVersionValidation', () => {
    it('should validate with valid id', () => {
      const result = GetTemplateVersionValidation.safeParse({ id: 'version-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = GetTemplateVersionValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  // ===========================================================================
  // MERGE FIELD VALIDATIONS
  // ===========================================================================

  describe('CreateMergeFieldValidation', () => {
    const validMergeField = {
      key: 'organization_name',
      label: 'Organization Name',
      defaultValue: 'My Dojo',
    };

    it('should accept valid data with minimal fields', () => {
      const result = CreateMergeFieldValidation.safeParse(validMergeField);

      expect(result.success).toBe(true);
    });

    it('should accept valid data with all fields', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        description: 'The name of the organization',
      });

      expect(result.success).toBe(true);
    });

    it('should accept keys with lowercase letters only', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'name',
      });

      expect(result.success).toBe(true);
    });

    it('should accept keys with lowercase letters and numbers', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'field2',
      });

      expect(result.success).toBe(true);
    });

    it('should accept keys with lowercase letters, numbers, and underscores', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'org_name_2',
      });

      expect(result.success).toBe(true);
    });

    it('should reject keys not starting with a lowercase letter', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: '1field',
      });

      expect(result.success).toBe(false);
    });

    it('should reject keys starting with an underscore', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: '_field',
      });

      expect(result.success).toBe(false);
    });

    it('should reject keys with uppercase letters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'orgName',
      });

      expect(result.success).toBe(false);
    });

    it('should reject keys with spaces', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'org name',
      });

      expect(result.success).toBe(false);
    });

    it('should reject keys with hyphens', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'org-name',
      });

      expect(result.success).toBe(false);
    });

    it('should reject keys with special characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'org.name',
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty key', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject key exceeding 50 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'a'.repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it('should accept key at exactly 50 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        key: 'a'.repeat(50),
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty label', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        label: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing label', () => {
      const result = CreateMergeFieldValidation.safeParse({
        key: 'org_name',
        defaultValue: 'My Dojo',
      });

      expect(result.success).toBe(false);
    });

    it('should reject label exceeding 100 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        label: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty defaultValue', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        defaultValue: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing defaultValue', () => {
      const result = CreateMergeFieldValidation.safeParse({
        key: 'org_name',
        label: 'Organization Name',
      });

      expect(result.success).toBe(false);
    });

    it('should reject defaultValue exceeding 500 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        defaultValue: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should accept optional description', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        description: 'A helpful description',
      });

      expect(result.success).toBe(true);
    });

    it('should reject description exceeding 500 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        description: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should accept description at exactly 500 characters', () => {
      const result = CreateMergeFieldValidation.safeParse({
        ...validMergeField,
        description: 'a'.repeat(500),
      });

      expect(result.success).toBe(true);
    });
  });

  describe('UpdateMergeFieldValidation', () => {
    it('should validate with only id', () => {
      const result = UpdateMergeFieldValidation.safeParse({ id: 'field-123' });

      expect(result.success).toBe(true);
    });

    it('should require id', () => {
      const result = UpdateMergeFieldValidation.safeParse({ label: 'Updated Label' });

      expect(result.success).toBe(false);
    });

    it('should accept partial update with only label', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        label: 'Updated Label',
      });

      expect(result.success).toBe(true);
    });

    it('should accept partial update with only defaultValue', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        defaultValue: 'Updated Default',
      });

      expect(result.success).toBe(true);
    });

    it('should accept nullable description', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        description: null,
      });

      expect(result.success).toBe(true);
    });

    it('should accept string description', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        description: 'Updated description',
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty label', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        label: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject label exceeding 100 characters', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        label: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty defaultValue', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        defaultValue: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject defaultValue exceeding 500 characters', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        defaultValue: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should reject description exceeding 500 characters', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        description: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it('should validate with all optional fields', () => {
      const result = UpdateMergeFieldValidation.safeParse({
        id: 'field-123',
        label: 'Updated Label',
        defaultValue: 'Updated Default',
        description: 'Updated description',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('DeleteMergeFieldValidation', () => {
    it('should validate with valid id', () => {
      const result = DeleteMergeFieldValidation.safeParse({ id: 'field-123' });

      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = DeleteMergeFieldValidation.safeParse({});

      expect(result.success).toBe(false);
    });
  });
});
