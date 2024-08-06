import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface PanelProps {
  children: ReactNode;
  title?: string;
  classes?: string;
  full?: boolean;
  white?: boolean;
}

export const Panel = (props: PanelProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-white text-gray-700 shadow",
        !props.full && "px-8 py-7",
        props.classes,
      )}
    >
      {props.title && (
        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
          {props.title}
        </h3>
      )}
      {props.children}
    </div>
  );
};
