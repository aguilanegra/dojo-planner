import { describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useHasPasswordAuth } from './useHasPasswordAuth';

// Mock user data
const mockPasswordUser = {
  firstName: 'John',
  lastName: 'Doe',
  passwordEnabled: true,
};

// Mock Clerk useUser hook
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockPasswordUser,
    isLoaded: true,
  }),
}));

describe('useHasPasswordAuth', () => {
  it('should return true for password-authenticated users', async () => {
    const { result } = await renderHook(() => useHasPasswordAuth());

    expect(result.current.hasPasswordAuth).toBe(true);
    expect(result.current.isLoadingAuth).toBe(false);
  });
});
