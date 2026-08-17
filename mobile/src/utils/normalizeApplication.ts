/** Normalize admin API responses that may arrive in snake_case from older backends. */
function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function normalizeKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[snakeToCamel(k)] = v;
  }
  return out;
}

// Not type-preserving: keys get renamed (snake_case -> camelCase), so the
// output isn't structurally a T even though it started as one — callers cast
// the result to whatever shape they actually expect (same as the web admin
// panel's identical normalizer in landing/lib/normalizeApplication.ts).
export function normalizeApplication(raw: Record<string, unknown>): Record<string, unknown> {
  const n = normalizeKeys(raw);
  return {
    ...n,
    applicationType: (n.applicationType ?? n.role ?? 'driver') as 'driver' | 'restaurant',
    incompleteSignup: Boolean(n.incompleteSignup),
  };
}

export function normalizeApplications(list: Record<string, unknown>[]): Record<string, unknown>[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => normalizeApplication(item));
}
