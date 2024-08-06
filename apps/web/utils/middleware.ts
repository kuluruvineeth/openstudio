import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export type NextHandler = (
  req: NextRequest,
  { params }: { params: Record<string, string | undefined> },
) => Promise<NextResponse | any>;

export function withError(handler: NextHandler): NextHandler {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      if (error instanceof ZodError) {
        if (env.LOG_ZOD_ERRORS) {
          console.error(`Error for url: ${req.url}`);
          console.error(error);
        }
        return NextResponse.json(
          { error: { issues: error.issues } },
          { status: 400 },
        );
      }

      if ((error as any)?.errors?.[0]?.reason === "insufficientPermissions") {
        return NextResponse.json(
          {
            error:
              "You must grant all Youtube permissions to use the app. Please log out and log in again to grant permissions.",
          },
          { status: 403 },
        );
      }

      if ((error as any)?.errors?.[0]?.reason === "rateLimitExceeded") {
        return NextResponse.json(
          {
            error: `You have exceeded the Youtube data rate limit. Please try again later. Error from Youtube Data: "${(error as any)?.errors?.[0]?.message}"`,
          },
          {
            status: 403,
          },
        );
      }

      if (isErrorWithConfigAndHeaders(error)) {
        delete error.config.headers;
      }

      console.error(`Error for url: ${req.url}`);
      console.error(error);
      return NextResponse.json({ error: "Server error" });
    }
  };
}

function isErrorWithConfigAndHeaders(
  error: unknown,
): error is { config: { headers: unknown } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "config" in error &&
    "headers" in (error as { config: any }).config
  );
}
