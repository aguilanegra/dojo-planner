import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { couponSchema } from '@/models/Schema';

// =============================================================================
// TYPES
// =============================================================================

export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  applicableTo: string;
  usageLimit: number | null;
  usageCount: number;
  status: string;
  validFrom: Date;
  validUntil: Date | null;
  createdAt: Date;
};

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all coupons for an organization
 */
export async function getOrganizationCoupons(organizationId: string): Promise<Coupon[]> {
  const coupons = await db
    .select()
    .from(couponSchema)
    .where(eq(couponSchema.organizationId, organizationId));

  return coupons.map(c => ({
    id: c.id,
    code: c.code,
    name: c.name,
    description: c.description,
    discountType: c.discountType,
    discountValue: c.discountValue,
    applicableTo: c.applicableTo,
    usageLimit: c.usageLimit,
    usageCount: c.usageCount ?? 0,
    status: c.status,
    validFrom: c.validFrom,
    validUntil: c.validUntil,
    createdAt: c.createdAt,
  }));
}

/**
 * Get a single coupon by ID
 */
export async function getCouponById(couponId: string, organizationId: string): Promise<Coupon | null> {
  const coupons = await db
    .select()
    .from(couponSchema)
    .where(eq(couponSchema.id, couponId));

  const coupon = coupons.find(c => c.organizationId === organizationId);
  if (!coupon) {
    return null;
  }

  return {
    id: coupon.id,
    code: coupon.code,
    name: coupon.name,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    applicableTo: coupon.applicableTo,
    usageLimit: coupon.usageLimit,
    usageCount: coupon.usageCount ?? 0,
    status: coupon.status,
    validFrom: coupon.validFrom,
    validUntil: coupon.validUntil,
    createdAt: coupon.createdAt,
  };
}

/**
 * Get active coupons for an organization
 */
export async function getActiveCoupons(organizationId: string): Promise<Coupon[]> {
  const coupons = await getOrganizationCoupons(organizationId);
  return coupons.filter(c => c.status === 'active');
}
