"use client";

import { toastError, toastSuccess } from "@openstudio/ui/components/Toast";
import { isActionError, ServerActionResponse } from "./error";

export function handleActionResult<T>(
  result: ServerActionResponse<T>,
  successMessage: string,
) {
  if (isActionError(result)) {
    toastError({ description: result.error });
  } else {
    toastSuccess({ description: successMessage });
  }
}
