import { ReactNode } from "react";
import { Panel } from "./Panel";

export function ErrorDisplay(props: {
  error: { info?: { error: string }; error?: string };
}) {
  if (props.error.info?.error || props.error.error) {
    return (
      <NotFound>
        There was an error: {props.error.info?.error || props.error.error}
      </NotFound>
    );
  }
}

const NotFound = (props: { children: ReactNode }) => {
  return (
    <div className="text-gray-700">
      <Panel>{props.children}</Panel>
    </div>
  );
};
