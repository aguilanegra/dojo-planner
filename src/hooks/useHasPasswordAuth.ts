import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export function useHasPasswordAuth() {
  const { user, isLoaded } = useUser();

  const hasPasswordAuth = useMemo(() => {
    if (!isLoaded || !user) {
      return false;
    }

    // Check if user has a password-based verification method
    // This is indicated by having a 'password' verification in their
    // external accounts list being empty (not SSO) and having a password set
    const hasPassword = user.passwordEnabled;

    return hasPassword;
  }, [user, isLoaded]);

  const isLoadingAuth = !isLoaded;

  return { hasPasswordAuth, isLoadingAuth };
}
