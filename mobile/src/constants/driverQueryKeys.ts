/** Driver query keys scoped by user id so sessions never share cached data. */
export const driverKeys = {
  root: (userId: string) => ['driver', userId] as const,
  stats: (userId: string) => ['driver', userId, 'stats'] as const,
  profile: (userId: string) => ['driver', userId, 'profile'] as const,
  available: (userId: string) => ['driver', userId, 'available'] as const,
  active: (userId: string) => ['driver', userId, 'active'] as const,
  history: (userId: string) => ['driver', userId, 'history'] as const,
  wallet: (userId: string) => ['driver', userId, 'wallet'] as const,
  documents: (userId: string) => ['driver', userId, 'documents'] as const,
  earnings: (userId: string, period?: string) => ['driver', userId, 'earnings', period ?? 'all'] as const,
};
