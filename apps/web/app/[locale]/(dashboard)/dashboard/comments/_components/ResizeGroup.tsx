import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@openstudio/ui/components/ui/resizable";
import React from "react";

export function ResizeGroup(props: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  if (!props.right) return <>{props.left}</>;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        style={{ overflow: "auto" }}
        defaultSize={50}
        minSize={30}
      >
        {props.left}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        {props.right}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
