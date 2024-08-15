"use client";
import { ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@openstudio/ui/lib/utils";

interface ScrollButtonProps {
  icon: ElementType;
  onClick?: () => void;
  disabled?: boolean;
}

export const ScrollButton = ({
  icon,
  onClick,
  disabled,
}: ScrollButtonProps) => {
  const Icon = icon;
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.();
      }, 300);
    } else {
      clearInterval(intervalRef.current as ReturnType<typeof setTimeout>);
    }

    return () =>
      clearInterval(intervalRef.current as ReturnType<typeof setTimeout>);
  }, [isPressed, onClick]);

  useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current as ReturnType<typeof setTimeout>);
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <button
      type="button"
      className={cn(
        //base
        "group inline-flex size-5 items-center truncate rounded transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setIsPressed(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setIsPressed(false);
      }}
    >
      <Icon className="size-full" aria-hidden="true" />
    </button>
  );
};
