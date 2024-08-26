import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { TooltipExplanation } from "../components/TooltipExplanation";


type LabelProps = Pick<InputProps, "name" | "label" | "tooltipText">;

export const Label = (props: LabelProps) => {
  return (
    <label
      htmlFor={props.name}
      className="block text-sm font-medium text-gray-700"
    >
      {props.tooltipText ? (
        <span className="flex items-center space-x-1">
          <span>{props.label}</span>
          <TooltipExplanation text={props.tooltipText} />
        </span>
      ) : (
        props.label
      )}
    </label>
  );
};

export const ExplainText = (props: { children: React.ReactNode }) => {
  return (
    <div className="mt-1 text-sm leading-snug text-gray-500">
      {props.children}
    </div>
  );
};

export const ErrorMessage = (props: { message: string }) => {
  return (
    <div className="mt-0.5 text-sm font-semibold leading-snug text-red-400">
      {props.message}
    </div>
  );
};

const InputWithLeftFixedText = (props: {
  leftText: string;
  inputProps: any;
}) => {
  return (
    <div className="flex rounded-md shadow-sm">
      <span className="inline-flex max-w-[150px] flex-shrink items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:max-w-full sm:text-sm">
        {props.leftText}
      </span>
      <input
        {...props.inputProps}
        className="block w-[120px] flex-1 rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:w-full sm:min-w-[150px] sm:max-w-full sm:text-sm"
      />
    </div>
  );
};

const InputWithRightFixedText = (props: {
  rightText: string;
  inputProps: any;
}) => {
  return (
    <div className="flex rounded-md shadow-sm">
      <input
        {...props.inputProps}
        className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 focus:border-black focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm"
      />
      <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
        {props.rightText}
      </span>
    </div>
  );
};

export const AddRemoveButtons = (props: {
  onClickAdd?: () => void;
  onClickRemove?: () => void;
}) => {
  if (!props.onClickAdd && !props.onClickRemove) return null;

  return (
    <div className="ml-2 flex space-x-2">
      {props.onClickAdd && (
        <button
          type="button"
          className="text-gray-700 transition-transform hover:scale-110 hover:text-gray-900"
          onClick={props.onClickAdd}
        >
          <PlusCircleIcon className="h-6 w-6" />
        </button>
      )}
      {props.onClickRemove && (
        <button
          type="button"
          className="text-gray-700 transition-transform hover:scale-110 hover:text-gray-900"
          onClick={props.onClickRemove}
        >
          <MinusCircleIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export function LabelWithRightButton(
  props: LabelProps & { rightButton: { text: string; onClick: () => void } },
) {
  return (
    <div className="flex justify-between">
      <Label {...props} />
      <button
        type="button"
        className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-sm text-transparent hover:from-sky-600 hover:to-blue-700"
        onClick={props.rightButton.onClick}
      >
        {props.rightButton.text}
      </button>
    </div>
  );
}

function getErrorMessage(
  errorType?: FieldError["type"],
  errorMessage?: FieldError["message"],
) {
  if (errorType === "required") return "This field is required";
  if (errorType === "minLength") return "This field is too short";
  if (errorType === "maxLength") return "This field is too long";

  return errorMessage;
}
