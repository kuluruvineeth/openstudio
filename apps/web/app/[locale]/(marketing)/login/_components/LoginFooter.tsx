import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LoginFooter() {
  const t = useTranslations("LOGIN");
  return (
    <>
      <p className="px-8 pt-10 text-center text-sm text-gray-500 dark:text-gray-200">
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-400"
        >
          {t("TERMS")}
        </Link>{" "}
        {t("AND")}{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-400"
        >
          {t("PRIVACY")}
        </Link>
        .
      </p>

      <p className="px-4 pt-4 text-center text-sm text-gray-500 dark:text-gray-200">
        {t("CAUTION")}{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          className="underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-400"
        >
          {t("GOOGLE_PRIVACY")}
        </a>{" "}
        {t("GOOGLE_TERMS")}
      </p>
    </>
  );
}
