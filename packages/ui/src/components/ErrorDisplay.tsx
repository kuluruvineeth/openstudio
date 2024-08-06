import { ReactNode } from "react";
import { Panel } from "./Panel";
import { ErrorInfo } from "./LoadingContent";

export function ErrorDisplay(props: { error: ErrorInfo }) {
  if (props.error.message) {
    return <NotFound>There was an error: {props.error.message}</NotFound>;
  }
}

const NotFound = (props: { children: ReactNode }) => {
  return (
    <div className="text-gray-700">
      <Panel>{props.children}</Panel>
    </div>
  );
};
