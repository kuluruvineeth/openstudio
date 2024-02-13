"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/shared/icons";

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<null>(null);
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="bg-background" onClick={() => {}}>
        {isLoading === "oauth_google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
