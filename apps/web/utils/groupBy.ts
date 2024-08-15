import { endOfWeek, format, parseISO, startOfWeek } from "date-fns";

export function groupBy<T>(
  data: T[],
  keyGetter: (item: T) => string,
): Map<string, T[]> {
  const map = new Map();
  data.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

interface DataItem {
  date: string;
  [key: string]: number | string;
}

interface AggregatedDataItem {
  date: string;
  [key: string]: number | string;
}

export function aggregateData<T extends DataItem>(
  data: T[],
  period: "day" | "week" | "month" | "year",
  fields: (keyof T)[],
): AggregatedDataItem[] {
  const formatOptions = {
    day: "yyyy-MM-dd",
    week: "yyyy-ww",
    month: "yyyy-MM",
    year: "yyyy",
  };

  const groupedData = groupBy(data, (item) => {
    const date = new Date(item.date);
    if (period === "week") {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(start, "yyyy-MM-dd")} to ${format(end, "yyyy-MM-dd")}`;
    } else {
      return format(date, formatOptions[period]);
    }
  });

  return Array.from(groupedData, ([date, items]) => {
    let formattedDate: string;

    if (period === "week") {
      const [start, end] = date.split(" to ");
      formattedDate = `${format(parseISO(start!), "MMM d")} - ${format(parseISO(end!), "MMM d")}`;
    } else if (period === "month") {
      formattedDate = format(new Date(date), "MMM yyyy");
    } else if (period === "year") {
      formattedDate = format(new Date(date), "yyyy");
    } else {
      formattedDate = format(new Date(date), "MMM d");
    }

    const aggregatedItem: AggregatedDataItem = { date: formattedDate };

    fields.forEach((field) => {
      aggregatedItem[field as string] = items.reduce(
        (acc, item) => acc + (item[field] as number),
        0,
      );
    });

    return aggregatedItem;
  });
}
