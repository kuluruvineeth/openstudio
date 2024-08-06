import { ReactNode } from "react";
import { ErrorDisplay } from "./ErrorDisplay";
import { Loading } from "@openstudio/ui/components/Loading";

interface LoadingContentProps {
  loading: boolean;
  loadingComponent?: ReactNode;
  error?: { info?: { error: string }; error?: string };
  errorComponent?: ReactNode;
  children: ReactNode;
}

export function LoadingContent(props: LoadingContentProps) {
  if (props.error) {
    return props.errorComponent ? (
      <>{props.errorComponent}</>
    ) : (
      <div className="mt-4">
        <ErrorDisplay error={props.error} />
      </div>
    );
  }

  if (props.loading) return <>{props.loadingComponent || <Loading />}</>;

  return <>{props.children}</>;
}
