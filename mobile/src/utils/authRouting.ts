import { User } from '@/types/auth.types';

/** Route authenticated users based on role and approval status. */
export function resolvePostAuthRoute(user: User): string {
  if (user.approvalStatus === 'suspended') {
    return '/(auth)/suspended';
  }
  if (
    (user.role === 'driver' || user.role === 'restaurant') &&
    user.approvalStatus === 'pending'
  ) {
    return '/(auth)/pending-approval';
  }
  if (user.role === 'driver') return '/(driver)';
  if (user.role === 'restaurant') return '/(restaurant)';
  if (user.role === 'admin') return '/(admin)';
  return '/(customer)';
}
