"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { Button } from "@openstudio/ui/components/Button";
import { SectionDescription } from "@openstudio/ui/components/Typography";
import { EarlyAccessModal } from "@/app/[locale]/(landing)/login/_components/EarlyAccessModal";
import { Provider } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const { isModalOpen, openModal, closeModal } = useModal();

  const SCOPES = [
    "openid https://www.googleapis.com/auth/userinfo.profile",
    "openid https://www.googleapis.com/auth/userinfo.email",
    "openid https://www.googleapis.com/auth/youtubepartner-channel-audit",
    "openid https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    "openid https://www.googleapis.com/auth/yt-analytics.readonly",
    "openid https://www.googleapis.com/auth/youtubepartner",
    "openid https://www.googleapis.com/auth/youtube.force-ssl",
    "openid https://www.googleapis.com/auth/youtube.channel-memberships.creator",
    "openid https://www.googleapis.com/auth/youtube.upload",
    "openid https://www.googleapis.com/auth/youtube",
    "openid https://www.googleapis.com/auth/youtube.readonly",
  ];

  async function socialAuth(provider: Provider) {
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          scope: SCOPES.join(" "),
        },
      },
    });
  }

  return (
    <>
      <div className="flex justify-center px-4 sm:px-16">
        <Button onClick={openModal} size="2xl">
          <span className="flex items-center justify-center">
            <Image
              src="/images/google.svg"
              alt=""
              width={24}
              height={24}
              unoptimized
            />
            <span className="ml-2">Sign in with Google</span>
          </span>
        </Button>
        <Modal title="Sign in" isOpen={isModalOpen} hideModal={closeModal}>
          <div className="mt-2">
            <SectionDescription>
              By continuing you agree to allow Open Studio sends your comments
              to OpenAI for processing. OpenAI does not use the submitted data
              to train or improve their AI models.
            </SectionDescription>
            <div className="mt-8">
              <SectionDescription>
                Open Studio{"'"}s use and transfer of information received from
                Google APIs to any other app will adhere to{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="underline underline-offset-4 hover:text-gray-900"
                >
                  Google API Services User Data
                </a>{" "}
                Policy, including the Limited Use requirements.
              </SectionDescription>
            </div>
            <div className="mt-8">
              <Button
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  socialAuth("google");
                }}
              >
                I agree
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <EarlyAccessModal />
    </>
  );
}
