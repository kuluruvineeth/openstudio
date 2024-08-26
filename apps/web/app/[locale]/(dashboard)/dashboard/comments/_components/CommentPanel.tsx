import { CommentItem } from "@/types/youtube/comment";
import { Tooltip } from "@openstudio/ui/components/Tooltip";
import { XIcon } from "lucide-react";

export function CommentPanel(props: { row: CommentItem; close: () => void }) {
  const { row, close } = props;

  return (
    <div className="flex h-full flex-col overflow-y-hidden border-l border-l-gray-100">
      <div className="sticky flex items-center justify-between border-b border-b-gray-100 p-4">
        <div className="">{row.commentedText}</div>

        <div className="ml-2 flex items-center">
          <Tooltip content="Close">
            <button
              onClick={close}
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
