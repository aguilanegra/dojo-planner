import type { Coupon, CouponApplyTo, CouponStatus, CouponType } from './types';
import type { Coupon as DbCoupon } from '@/hooks/useCouponsCache';

/**
 * Transforms database coupon type to UI display type
 */
function transformDiscountType(discountType: string): CouponType {
  switch (discountType.toLowerCase()) {
    case 'percentage':
      return 'Percentage';
    case 'fixed':
      return 'Fixed Amount';
    case 'free_days':
      return 'Free Trial';
    default:
      return 'Percentage';
  }
}

/**
 * Transforms database applicable_to to UI display format
 */
function transformApplicableTo(applicableTo: string): CouponApplyTo {
  switch (applicableTo.toLowerCase()) {
    case 'membership':
    case 'memberships':
      return 'Memberships';
    case 'event':
    case 'product':
    case 'products':
      return 'Products';
    case 'all':
    case 'both':
      return 'Both';
    default:
      return 'Memberships';
  }
}

/**
 * Transforms database status to UI display format
 */
function transformStatus(status: string): CouponStatus {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'inactive':
      return 'Inactive';
    default:
      return 'Active';
  }
}

/**
 * Formats discount value based on type
 */
function formatAmount(discountType: string, discountValue: number): string {
  switch (discountType.toLowerCase()) {
    case 'percentage':
      return `${discountValue}%`;
    case 'fixed':
      return `$${discountValue}`;
    case 'free_days':
      return `${discountValue} Days`;
    default:
      return String(discountValue);
  }
}

/**
 * Formats usage as "count/limit" string
 */
function formatUsage(usageCount: number, usageLimit: number | null): string {
  if (usageLimit === null) {
    return `${usageCount}/\u221E`;
  }
  return `${usageCount}/${usageLimit}`;
}

/**
 * Formats Date to ISO datetime string
 */
function formatDateTime(date: Date | null): string {
  if (!date) {
    return '';
  }
  return date.toISOString();
}

/**
 * Transforms a database coupon to UI coupon format
 */
export function transformCouponToUi(dbCoupon: DbCoupon): Coupon {
  return {
    id: dbCoupon.id,
    code: dbCoupon.code,
    description: dbCoupon.description || dbCoupon.name,
    type: transformDiscountType(dbCoupon.discountType),
    amount: formatAmount(dbCoupon.discountType, dbCoupon.discountValue),
    applyTo: transformApplicableTo(dbCoupon.applicableTo),
    usage: formatUsage(dbCoupon.usageCount, dbCoupon.usageLimit),
    startDateTime: formatDateTime(dbCoupon.validFrom),
    endDateTime: formatDateTime(dbCoupon.validUntil),
    status: transformStatus(dbCoupon.status),
  };
}

/**
 * Transforms an array of database coupons to UI format
 */
export function transformCouponsToUi(dbCoupons: DbCoupon[]): Coupon[] {
  return dbCoupons.map(transformCouponToUi);
}
