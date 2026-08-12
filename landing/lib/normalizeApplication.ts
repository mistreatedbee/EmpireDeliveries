/** Normalize admin API responses that may arrive in snake_case from older backends. */
function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function normalizeKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const camel = snakeToCamel(k);
    out[camel] = v;
  }
  return out;
}

export function normalizeApplication(raw: Record<string, unknown>) {
  const n = normalizeKeys(raw);
  return {
    ...n,
    applicationType: (n.applicationType ?? n.role ?? 'driver') as 'driver' | 'restaurant',
    incompleteSignup: Boolean(n.incompleteSignup),
  };
}

export function normalizeApplications(list: unknown[]): Record<string, unknown>[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => normalizeApplication(item as Record<string, unknown>));
}
