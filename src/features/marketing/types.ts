export type CouponType = 'Percentage' | 'Fixed Amount' | 'Free Trial';
export type CouponApplyTo = 'Memberships' | 'Products' | 'Both';
export type CouponStatus = 'Active' | 'Expired' | 'Inactive';

export type Coupon = {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  amount: string;
  applyTo: CouponApplyTo;
  usage: string;
  expiry: string;
  status: CouponStatus;
};

export type CouponFormData = {
  code: string;
  description: string;
  type: CouponType;
  amount: string;
  applyTo: CouponApplyTo;
  usageLimit: string;
  expiry: string;
  status: CouponStatus;
};
