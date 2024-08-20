import { ButtonGroup } from "@openstudio/ui/components/ButtonGroup";
import { LoadingMiniSpinner } from "@openstudio/ui/components/Loading";
import { OrbitIcon } from "lucide-react";
import { useMemo } from "react";

export function ActionButtonsBulk(props: {
  isCategorizing: boolean;
  onAiCategorize: () => void;
}) {
  const { isCategorizing, onAiCategorize } = props;
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

  return <ButtonGroup buttons={buttons} />;
}
