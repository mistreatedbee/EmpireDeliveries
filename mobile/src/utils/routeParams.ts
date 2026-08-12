/** Expo Router may return dynamic segment params as string[]. */
export function normalizeRouteParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
