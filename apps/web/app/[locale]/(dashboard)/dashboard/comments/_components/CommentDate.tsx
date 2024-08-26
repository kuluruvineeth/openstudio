import { formatShortDate } from "@/utils/date";

export function CommentDate(props: { date: Date }) {
  return (
    <div className="flex-shrink-0 text-sm font-medium leading-5 text-gray-500">
      {formatShortDate(props.date, { includeYear: true, lowerCase: true })}
    </div>
  );
}
