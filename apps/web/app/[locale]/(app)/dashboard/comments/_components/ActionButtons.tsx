import { ButtonGroup } from "@openstudio/ui/components/ButtonGroup";
import { LoadingMiniSpinner } from "@openstudio/ui/components/Loading";
import { OrbitIcon } from "lucide-react";
import { useMemo } from "react";

export function ActionButtons(props: {
  commentId: string;
  shadow?: boolean;
  isCategorizing: boolean;
  onAiCategorize: () => void;
  refetch: () => void;
}) {
  const { commentId, shadow, isCategorizing, onAiCategorize, refetch } = props;

  const buttons = useMemo(
    () => [
      {
        tooltip: "AI Categorize",
        onClick: onAiCategorize,
        icon: isCategorizing ? (
          <LoadingMiniSpinner />
        ) : (
          <OrbitIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
        ),
      },
    ],
    [isCategorizing, onAiCategorize],
  );

  return <ButtonGroup buttons={buttons} shadow={shadow} />;
}
