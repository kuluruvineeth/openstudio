"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { Button } from "@openstudio/ui/components/Button";
import { SectionDescription } from "@openstudio/ui/components/Typography";
import { EarlyAccessModal } from "@/app/[locale]/(landing)/login/_components/EarlyAccessModal";
import { Provider } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("LOGIN");
  const [loading, setLoading] = useState(false);

  const { isModalOpen, openModal, closeModal } = useModal();

  const SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/youtubepartner-channel-audit",
    "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.readonly",
  ];

  async function socialAuth(provider: Provider) {
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          scope: SCOPES.join(" "),
          access_type: "offline",
          prompt: "consent", //<- Optional. The refresh-token gets returned
          //only immediately after consent. It will not be
          //re-issued on sessionRefresh or Login.
          //Therefore, for test purposes I
          //"force" consent every time.
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
            <span className="ml-2">{t("LOGIN_FORM.SIGN_WITH_GOOGLE")}</span>
          </span>
        </Button>
        <Modal title={t("TITLE")} isOpen={isModalOpen} hideModal={closeModal}>
          <div className="mt-2">
            <SectionDescription>
              {t("LOGIN_FORM.BY_CONTINUING")}
            </SectionDescription>
            <div className="mt-8">
              <SectionDescription>
                {t("LOGIN_FORM.USAGE_CONSENT")}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="underline underline-offset-4 hover:text-gray-900"
                >
                  {t("GOOGLE_PRIVACY")}
                </a>{" "}
                {t("GOOGLE_TERMS")}
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
                {t("LOGIN_FORM.AGREE")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <EarlyAccessModal />
    </>
  );
}
