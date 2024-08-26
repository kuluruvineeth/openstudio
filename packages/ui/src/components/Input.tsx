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


function getErrorMessage(
  errorType?: FieldError["type"],
  errorMessage?: FieldError["message"],
) {
  if (errorType === "required") return "This field is required";
  if (errorType === "minLength") return "This field is too short";
  if (errorType === "maxLength") return "This field is too long";

  return errorMessage;
}
