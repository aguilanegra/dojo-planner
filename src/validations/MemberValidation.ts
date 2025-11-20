import * as z from 'zod';

export const MemberValidation = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  memberType: z.enum(['individual', 'family-member', 'head-of-household']).optional(),
  address: z.object({
    street: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  subscriptionPlan: z.enum(['free-trial', 'monthly', 'annual', 'custom']).optional(),
});

export const EditMemberValidation = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().nullable().optional(),
});

export const DeleteMemberValidation = z.object({
  id: z.string(),
});
