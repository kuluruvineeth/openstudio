import { Input } from "@/components/ui/input";

export default function TranscriptionItem({
  item,
  handleStartTimeChange,
  handleEndTimeChange,
  handleContentChange,
}: any) {
  if (!item) {
    return "";
  }
  return (
    <div className="my-1 grid grid-cols-3 gap-1 items-center">
      <Input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={item.start_time}
        onChange={handleStartTimeChange}
      />
      <Input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={item.end_time}
        onChange={handleEndTimeChange}
      />
      <Input
        type="text"
        className="bg-white/20 p-1 rounded-md"
        value={item.content}
        onChange={handleContentChange}
      />
    </div>
  );
}
