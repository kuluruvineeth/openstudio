import { useTranslations } from "next-intl";

export default function LoginHeader() {
  const t = useTranslations("LOGIN");
  return (
    <div className="flex flex-col text-center">
      <h1 className="font-cal text-2xl">{t("TITLE")}</h1>
      <p className="mt-4">{t("DESCRIPTION")}</p>
    </div>
  );
}
