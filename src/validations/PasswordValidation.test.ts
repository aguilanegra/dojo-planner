import { describe, expect, it } from 'vitest';
import { isStrongPassword, PasswordValidation } from './PasswordValidation';

describe('PasswordValidation', () => {
  describe('isStrongPassword', () => {
    it('should return true for a strong password', () => {
      expect(isStrongPassword('StrongP@ss1')).toBe(true); // ggignore
      expect(isStrongPassword('Complex!Pass123')).toBe(true); // ggignore
      expect(isStrongPassword('MyP@ssword1')).toBe(true); // ggignore
    });

    it('should return false for passwords shorter than 8 characters', () => {
      expect(isStrongPassword('Sh@rt1')).toBe(false);
      expect(isStrongPassword('A@1bcde')).toBe(false);
    });

    it('should return false for passwords without uppercase', () => {
      expect(isStrongPassword('lowercase@123')).toBe(false);
    });

    it('should return false for passwords without lowercase', () => {
      expect(isStrongPassword('UPPERCASE@123')).toBe(false);
    });

    it('should return false for passwords without numbers', () => {
      expect(isStrongPassword('NoNumbers@Here')).toBe(false);
    });

    it('should return false for passwords without special characters', () => {
      expect(isStrongPassword('NoSpecial123')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isStrongPassword('')).toBe(false);
    });
  });

  describe('PasswordValidation schema', () => {
    it('should validate a correct password change form', () => {
      const validData = {
        currentPassword: 'currentpass',
        newPassword: 'StrongP@ss1!', // ggignore
        confirmPassword: 'StrongP@ss1!', // ggignore
      };

      const result = PasswordValidation.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should fail when currentPassword is empty', () => {
      const invalidData = {
        currentPassword: '',
        newPassword: 'StrongP@ss1!', // ggignore
        confirmPassword: 'StrongP@ss1!', // ggignore
      };

      const result = PasswordValidation.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should fail when newPassword is too weak', () => {
      const invalidData = {
        currentPassword: 'currentpass',
        newPassword: 'weak',
        confirmPassword: 'weak',
      };

      const result = PasswordValidation.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should fail when passwords do not match', () => {
      const invalidData = {
        currentPassword: 'currentpass',
        newPassword: 'StrongP@ss1!', // ggignore
        confirmPassword: 'DifferentP@ss1!', // ggignore
      };

      const result = PasswordValidation.safeParse(invalidData);

      expect(result.success).toBe(false);

      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(
          issue => issue.path.includes('confirmPassword'),
        );

        expect(confirmPasswordError?.message).toBe('passwords_do_not_match');
      }
    });

    it('should fail when confirmPassword is empty', () => {
      const invalidData = {
        currentPassword: 'currentpass',
        newPassword: 'StrongP@ss1!', // ggignore
        confirmPassword: '',
      };

      const result = PasswordValidation.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should validate password with all special character types', () => {
      const specialCharPasswords = [
        'Password1!',
        'Password1@',
        'Password1#',
        'Password1$',
        'Password1%',
        'Password1^',
        'Password1&',
        'Password1*',
        'Password1(',
        'Password1)',
        'Password1,',
        'Password1.',
        'Password1?',
        'Password1:',
        'Password1{',
        'Password1}',
        'Password1|',
        'Password1<',
        'Password1>',
        'Password1[',
        'Password1]',
        'Password1\'',
        'Password1`',
        'Password1~',
        'Password1_',
        'Password1+',
        'Password1=',
        'Password1-',
      ];

      specialCharPasswords.forEach((password) => {
        const result = PasswordValidation.safeParse({
          currentPassword: 'currentpass',
          newPassword: password,
          confirmPassword: password,
        });

        expect(result.success).toBe(true);
      });
    });
  });
});
