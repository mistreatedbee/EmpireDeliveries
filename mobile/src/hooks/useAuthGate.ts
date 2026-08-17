import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/auth.types';

interface AuthGateOptions {
  /** If set, only this role may access the layout. Others are sent to their home route. */
  requiredRole?: UserRole;
}

/** Shared auth bootstrap for tab layouts — avoids stuck loading when hydration lags. */
export function useAuthGate(options: AuthGateOptions = {}) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { requiredRole } = options;

  // Do NOT re-run hydrate() here. AuthBootstrap (app/_layout.tsx) already
  // hydrates once at app launch, and login's setAuth() already puts fully
  // correct state in the store synchronously before navigating here. Calling
  // hydrate() again on every role-gated layout mount raced that fresh state:
  // it re-reads the token (SecureStore) and user (AsyncStorage) as two
  // independent async reads, and if that read landed before/between the
  // just-completed writes, `user` could transiently resolve to null while
  // `isAuthenticated` stayed true — which then fails the requiredRole check
  // below and bounces the user straight back out immediately after login.

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      if (user?.role === 'admin') router.replace('/(admin)');
      else if (user?.role === 'driver') router.replace('/(driver)');
      else if (user?.role === 'restaurant') router.replace('/(restaurant)');
      // '(customer)' has no direct index route (only nested (home)/(orders)/etc.
      // groups), so it isn't in expo-router's generated typed-route union —
      // same workaround already used for this exact case in location-setup.tsx.
      else router.replace('/(customer)' as any);
    }
  }, [isAuthenticated, isLoading, requiredRole, user?.role]);

  const allowed =
    !isLoading &&
    isAuthenticated &&
    (!requiredRole || user?.role === requiredRole);

  return { isLoading, isAuthenticated, user, allowed };
}
