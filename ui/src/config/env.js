/** Default farm zone for snapshot/history when the UI does not pick an area. */
export function getDefaultAreaId() {
  const n = Number(import.meta.env.VITE_DEFAULT_AREA_ID);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
