import type React from "react";
import { AlertCircle, TerminalIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export function AlertBasic(props: {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode | null;
  variant?: "default" | "destructive" | "success" | "red";
  className?: string;
}) {
  return (
    <Alert variant={props.variant} className={props.className}>
      {props.icon === null
        ? null
        : props.icon || <TerminalIcon className="h-4 w-4" />}
      {props.title ? <AlertTitle>{props.title}</AlertTitle> : null}
      {props.description ? (
        <AlertDescription>{props.description}</AlertDescription>
      ) : null}
    </Alert>
  );
}
