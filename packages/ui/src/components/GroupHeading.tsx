import React from "react";
import { Button } from "./Button";

export function GroupHeading(props: {
  leftContent: React.ReactNode;
  buttons?: { label: string; loading?: boolean; onClick: () => void }[];
}) {
  const { leftContent, buttons } = props;
  return (
    <div className="flex max-w-full flex-wrap items-center gap-x-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
      <h1 className="text-base font-semibold leading-7 text-gray-900">
        {leftContent}
      </h1>

      <div className="ml-auto flex items-center gap-x-1 py-2">
        {buttons?.map((button) => (
          <Button
            key={button.label}
            size="md"
            onClick={button.onClick}
            loading={button.loading}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
