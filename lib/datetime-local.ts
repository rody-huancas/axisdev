/**
 * Valores de <input type="datetime-local"> son fecha/hora civil sin zona.
 * Evita `new Date(string)` para esos valores (comportamiento inconsistente).
 */
export function formatDateTimeLocalValue(date: Date): string {
  const y  = date.getFullYear();
  const m  = String(date.getMonth() + 1).padStart(2, "0");
  const d  = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

/** Interpreta el valor del input como hora local del usuario. */
export function parseDateTimeLocalValue(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value.trim());
  if (!match) {
    return new Date(NaN);
  }
  const y   = Number(match[1]);
  const mo  = Number(match[2]);
  const day = Number(match[3]);
  const hh  = Number(match[4]);
  const min = Number(match[5]);
  return new Date(y, mo - 1, day, hh, min, 0, 0);
}
