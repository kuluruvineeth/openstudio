import type { FieldError } from "react-hook-form";
import { ErrorMessage, ExplainText, Label } from "./Input";
import { cn } from "../lib/utils";
interface SelectProps<T> {
  name: string;
  label: string;
  options: Array<{ label: string; value: T }>;
  explainText?: string;
  error?: FieldError;
  registerProps?: any; // TODO
  disabled?: boolean;
}

export function Select<T extends string | number = string>(
  props: SelectProps<T>,
) {
  return (
    <div>
      {props.label ? <Label name={props.name} label={props.label} /> : null}
      <select
        id={props.name}
        name={props.name}
        className={cn(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6",
          props.label && "mt-1",
        )}
        disabled={props.disabled}
        {...props.registerProps}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {props.explainText ? (
        <ExplainText>{props.explainText}</ExplainText>
      ) : null}
      {props.error?.message ? (
        <ErrorMessage message={props.error?.message} />
      ) : null}
    </div>
  );
}
