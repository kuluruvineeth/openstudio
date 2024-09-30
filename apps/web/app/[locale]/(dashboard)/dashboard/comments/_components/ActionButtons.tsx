import { onDeleteComment } from "@/utils/actions/client";
import { ButtonGroup } from "@openstudio/ui/components/ButtonGroup";
import { LoadingMiniSpinner } from "@openstudio/ui/components/Loading";
import { OrbitIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export function ActionButtons(props: {
  commentId: string;
  isPlanning: boolean;
  shadow?: boolean;
  isCategorizing: boolean;
  onPlanAiAction: () => void;
  onAiCategorize: () => void;
  refetch: () => void;
}) {
  const {
    commentId,
    shadow,
    isPlanning,
    onPlanAiAction,
    isCategorizing,
    onAiCategorize,
    refetch,
  } = props;

  const [isdeleting, setIsDeleting] = useState(false);

  const onDelete = useCallback(async () => {
    setIsDeleting(true);
    await onDeleteComment(commentId);
    refetch();
    setIsDeleting(false);
  }, [commentId, refetch]);

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
      {
        tooltip: "Run AI Rules",
        onClick: onPlanAiAction,
        icon: isPlanning ? (
          <LoadingMiniSpinner />
        ) : (
          <SparklesIcon className="h-4 w-4 text-gray-700" />
        ),
      },
      {
        tooltip: "Delete",
        onClick: onDelete,
        icon: isdeleting ? (
          <LoadingMiniSpinner />
        ) : (
          <Trash2Icon className="h-4 w-4 text-gray-700" aria-hidden="true" />
        ),
      },
    ],
    [
      isCategorizing,
      onAiCategorize,
      onDelete,
      isdeleting,
      onPlanAiAction,
      isPlanning,
    ],
  );

  return <ButtonGroup buttons={buttons} shadow={shadow} />;
}
