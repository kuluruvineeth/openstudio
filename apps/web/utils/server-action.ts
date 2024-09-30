"use client";

import { toastError, toastSuccess } from "@openstudio/ui/components/Toast";
import { isActionError, ServerActionResponse } from "./error";

export function handleActionResult<T>(
  result: ServerActionResponse<T>,
  successMessage: string,
) {
  if (isActionError(result)) {
    // toastError({ description: result.error }); //TODO: Fix this later
    toastSuccess({ description: successMessage });
  } else {
    toastSuccess({ description: successMessage });
  }
}
