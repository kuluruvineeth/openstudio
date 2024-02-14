"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { siteConfig } from "@/config/site";
import { useSigninModal } from "@/hooks/use-signin-model";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Modal } from "@/components/shared/modal";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const SignInModal = () => {
  const [signInClicked, setSignInClicked] = useState(false);
  const signInModal = useSigninModal();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="h-10 w-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Unlock AI-Powered Your Studio Management. Sign in seamlessly with
            your Google account with one simple click to access tailored studio
            insights, customized content tracking and creative analysis from
            OpenStudio.
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              onClick("google");
              signInModal.onClose();
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Sign In with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};
