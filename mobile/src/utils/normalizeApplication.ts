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

export function normalizeApplication<T extends Record<string, unknown>>(raw: T): T & Record<string, unknown> {
  const n = normalizeKeys(raw);
  return {
    ...n,
    applicationType: (n.applicationType ?? n.role ?? 'driver') as 'driver' | 'restaurant',
    incompleteSignup: Boolean(n.incompleteSignup),
  } as T & Record<string, unknown>;
}

export function normalizeApplications<T extends Record<string, unknown>>(list: T[]): (T & Record<string, unknown>)[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => normalizeApplication(item));
}
