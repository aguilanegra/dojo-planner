import * as z from 'zod';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\\;'`~_+=-]).{8,}$/;

export const PasswordValidation = z.object({
  currentPassword: z.string().min(1, 'password_required'),
  newPassword: z.string()
    .min(8, 'password_too_weak')
    .regex(strongPasswordRegex, 'password_too_weak'),
  confirmPassword: z.string().min(1, 'password_required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'passwords_do_not_match',
  path: ['confirmPassword'],
});

export function isStrongPassword(password: string): boolean {
  return strongPasswordRegex.test(password);
}
