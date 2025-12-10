import { describe, expect, it } from 'vitest';
import { ProfileValidation } from './ProfileValidation';

describe('ProfileValidation', () => {
  it('should validate a correct profile form', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const result = ProfileValidation.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('should fail when firstName is empty', () => {
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const result = ProfileValidation.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const firstNameError = result.error.issues.find(
        issue => issue.path.includes('firstName'),
      );

      expect(firstNameError?.message).toBe('first_name_required');
    }
  });

  it('should fail when lastName is empty', () => {
    const invalidData = {
      firstName: 'John',
      lastName: '',
      email: 'john.doe@example.com',
    };

    const result = ProfileValidation.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const lastNameError = result.error.issues.find(
        issue => issue.path.includes('lastName'),
      );

      expect(lastNameError?.message).toBe('last_name_required');
    }
  });

  it('should fail when email is empty', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
    };

    const result = ProfileValidation.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      const emailError = result.error.issues.find(
        issue => issue.path.includes('email'),
      );

      expect(emailError?.message).toBe('email_required');
    }
  });
});
