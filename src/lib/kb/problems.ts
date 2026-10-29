// The problems #4471 really holds, counted the way the desk counts: by cause (causes.ts), from the
// export. The desk files a one-day move under its tenant's cause and reads it apart (desk-notes.json);
// here the one-day move also gets a ticket of its own, so it is no longer only a footnote.
import notes from '#lib/data/desk-notes.json';
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day';

export const PROBLEMS: { id: Problem; issue: number; what: string }[] = [
  { id: 'parser', issue: 1, what: 'the shared parser reads every date month first; day-first tenants get day and month swapped' },
  { id: 'hint', issue: 2, what: 'booking-v3 prints MM/DD/YYYY under its date field, people type month first, the form reads it day first' },
  { id: 'one-day', issue: 3, what: 'the date lands one day off, or on different days in different time zones: not a swap' },
];

// Does this report belong to this problem? parser and hint by cause; one-day by the desk's reading.
export function inProblem(p: Problem, r: Report, t: Tenant | undefined, oneDay: readonly string[] = notes.oneDayMove): boolean {
  return p === 'one-day' ? oneDay.includes(r.id) : causeOf(r, t) === p;
}
