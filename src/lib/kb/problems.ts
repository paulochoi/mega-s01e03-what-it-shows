// The problems #4471 really holds. causes.ts sorts a report by its tenant and channel; that is
// right for a month flip, but a report that describes a one-day shift is not a month flip at all.
// The desk already read those (desk-notes.json); here they get a problem of their own instead of a footnote.
import notes from '#lib/data/desk-notes.json';
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export const PROBLEMS: { id: Problem; issue: number | null; what: string }[] = [
  { id: 'parser', issue: 1, what: 'the shared parser reads every date month first; day-first tenants get day and month swapped' },
  { id: 'hint', issue: 2, what: 'booking-v3 prints MM/DD/YYYY under its date field, people type month first, the form reads it day first' },
  { id: 'one-day', issue: 3, what: 'the date lands one day off, or on different days for people in different time zones: not a swap' },
  { id: 'unplaced', issue: null, what: 'no tenant on file, or a tenant that writes the month first' },
];

export function problemOf(r: Report, t: Tenant | undefined, oneDay: readonly string[] = notes.oneDayMove): Problem {
  if (oneDay.includes(r.id)) return 'one-day';
  return causeOf(r, t) ?? 'unplaced';
}
