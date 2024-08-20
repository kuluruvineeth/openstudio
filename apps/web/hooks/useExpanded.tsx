"use client";

import { useCallback, useState } from "react";
import { Button } from "@openstudio/ui/components/ui/button";
import { ChevronsDownIcon, ChevronsUpIcon } from "lucide-react";

export const useExpanded = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const toggleExpand = useCallback(
    (index: number) =>
      setExpandedIndex((prevIndex) => (prevIndex === index ? null : index)),
    [],
  );

  const extra = useCallback(
    (index: number) => {
      return (
        <div className="mt-2">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => toggleExpand(index)}
            className="w-full"
          >
            {expandedIndex === index ? (
              <>
                <ChevronsUpIcon className="h-4 w-4" />
                <span className="ml-2">Show less</span>
              </>
            ) : (
              <>
                <ChevronsDownIcon className="h-4 w-4" />
                <span className="ml-2">Show more</span>
              </>
            )}
          </Button>
        </div>
      );
    },
    [expandedIndex, toggleExpand],
  );

  return { expandedIndex, extra };
};