import { cn } from "../lib/utils";
export function FormWrapper(props: { children: React.ReactNode }) {
  return <div className="divide-y divide-black/5">{props.children}</div>;
}

export function FormSection(props: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={props.id}
      className={cn(
        "content-container grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
