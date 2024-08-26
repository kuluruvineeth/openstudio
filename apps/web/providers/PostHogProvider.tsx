"use client";

import { env } from "@/env.mjs";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// based on: https://posthog.com/docs/libraries/next-js

if (typeof window !== "undefined" && env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    // https://posthog.com/docs/advanced/proxy/nextjs
    api_host: `${window.location.origin}/ingest`,
    capture_pageview: false,
  });
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PostHogIdentify(): JSX.Element {
  useEffect(() => {
    const identifyUser = async () => {
      try {
        const { data, error } = await supabaseBrowserClient.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
        } else {
          posthog.identify(data.user.email);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    identifyUser();
  }, [supabaseBrowserClient.auth]);

  return <></>;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
