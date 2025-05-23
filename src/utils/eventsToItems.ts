import { filterEventByPatterns } from './filterEventByPatterns';

import type { CalendarEvent } from './calendarEvents';
import type { CalendarItem } from './calendarItem';
import type { ItemSettings } from './itemSettings';
import type { TrashCardConfig } from '../cards/trash-card/trash-card-config';

interface Options {
  pattern: Required<TrashCardConfig>['pattern'];
  useSummary: boolean;
}

type Pattern = Options['pattern'][number];

const getLabel = (event: CalendarEvent, settings: ItemSettings, useSummary: boolean): string => {
  if (useSummary && event.content.summary) {
    return event.content.summary;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return settings.label ?? event.content.summary ?? 'unknown';
};

const getData = (event: CalendarEvent, pattern: Pattern & { idx: number }, useSummary: boolean): CalendarItem => ({
  ...event,
  ...pattern,
  label: getLabel(event, pattern, useSummary),
  type: pattern.type === 'custom' ? `custom-${pattern.idx}` : pattern.type,
  description: event.content.description ?? event.content.summary,
});

const eventToItem = (event: CalendarEvent | undefined, { pattern, useSummary }: Options): CalendarItem[] => {
  if (!event || !('summary' in event.content)) {
    return [];
  }

  const possibleTypes = pattern.
    map((pat, idx) => ({
      ...pat,
      idx
    })).
    filter(pat => filterEventByPatterns(pat, event));

  if (possibleTypes.length > 0) {
    return possibleTypes.map(pat => getData(event, pat, useSummary));
  }

  return [ getData(event, { ...pattern.find(pat => pat.type === 'others')!, idx: 0 }, useSummary) ];
};

const eventsToItems = (events: CalendarEvent[], options: Options): CalendarItem[] => {
  const items = events.reduce<CalendarItem[]>((prev, event): CalendarItem[] => {
    const itemsFromEvents = eventToItem(event, options);

    return [ ...prev, ...itemsFromEvents ];
  }, []);

  return items.filter((item): boolean => Boolean(item));
};

export {
  eventsToItems
};
