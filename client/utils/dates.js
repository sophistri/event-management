// Small date helpers for the events UI. All use the viewer's own locale and timezone.

const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'short' });
const weekdayTimeFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const monthShort = (iso) => monthFmt.format(new Date(iso));
export const dayOfMonth = (iso) => new Date(iso).getDate();
export const weekdayAndTime = (iso) => weekdayTimeFmt.format(new Date(iso));

// Same-day events read as one date with a time range; multi-day events show both ends in full.
export function formatRange(startIso, endIso) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (start.toDateString() === end.toDateString()) {
    return `${dateFmt.format(start)}, ${timeFmt.format(start)} to ${timeFmt.format(end)}`;
  }
  return `${dateTimeFmt.format(start)} to ${dateTimeFmt.format(end)}`;
}