import { MessageText } from "@openstudio/ui/components/Typography";
import { ButtonLoader } from "@openstudio/ui/components/ui/button";

export function LoadProgress(props: {}) {
  return (
    <div className="mr-4 flex max-w-xs items-center">
      <ButtonLoader />
      <MessageText className="hidden sm:block">
        Loading new comments...
      </MessageText>
    </div>
  );
}
