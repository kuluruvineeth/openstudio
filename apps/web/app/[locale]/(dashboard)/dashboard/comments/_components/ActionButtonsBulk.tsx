import { ButtonGroup } from "@openstudio/ui/components/ButtonGroup";
import { LoadingMiniSpinner } from "@openstudio/ui/components/Loading";
import {
  CheckCircleIcon,
  OrbitIcon,
  SparklesIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

export function ActionButtonsBulk(props: {
  isCategorizing: boolean;
  isPlanning: boolean;
  isDeleting: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  onAiCategorize: () => void;
  onPlanAiAction: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const {
    isCategorizing,
    isPlanning,
    isDeleting,
    isApproving,
    isRejecting,
    onAiCategorize,
    onPlanAiAction,
    onDelete,
    onApprove,
    onReject,
  } = props;
  const buttons = useMemo(
    () => [
      {
        tooltip: "Run AI Rules",
        onClick: onPlanAiAction,
        icon: isPlanning ? (
          <LoadingMiniSpinner />
        ) : (
          <SparklesIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
        ),
      },
      {
        tooltip: "Approve AI Action",
        onClick: onApprove,
        icon: isApproving ? (
          <LoadingMiniSpinner />
        ) : (
          <CheckCircleIcon
            className="w-4 h-4 text-gray-700"
            aria-hidden="true"
          />
        ),
      },
      {
        tooltip: "Reject AI Action",
        onClick: onReject,
        icon: isRejecting ? (
          <LoadingMiniSpinner />
        ) : (
          <XCircleIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
        ),
      },
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
        tooltip: "Delete",
        onClick: onDelete,
        icon: isDeleting ? (
          <LoadingMiniSpinner />
        ) : (
          <Trash2Icon className="h-4 w-4 text-gray-700" aria-hidden="true" />
        ),
      },
    ],
    [
      isCategorizing,
      isApproving,
      isDeleting,
      isPlanning,
      isRejecting,
      onApprove,
      onDelete,
      onPlanAiAction,
      onReject,
      onAiCategorize,
    ],
  );

  return <ButtonGroup buttons={buttons} />;
}
