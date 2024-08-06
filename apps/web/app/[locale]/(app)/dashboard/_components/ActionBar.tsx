import { DateRangePicker } from "@openstudio/ui/components/DateRangePicker";

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface ActionBarProps {
  dateRange?: DateRange | undefined;
  onDateRangeUpdate: (range?: DateRange) => void;
}

export function ActionBar({ dateRange, onDateRangeUpdate }: ActionBarProps) {
  return (
    <div className="space-y-1 sm:flex sm:space-x-1 sm:space-y-0">
      <DateRangePicker
        onUpdate={onDateRangeUpdate}
        initialDateFrom={dateRange?.from}
        initialDateTo={dateRange?.to}
        align="start"
        locale="en-GB"
        showCompare={false}
      />
    </div>
  );
}
