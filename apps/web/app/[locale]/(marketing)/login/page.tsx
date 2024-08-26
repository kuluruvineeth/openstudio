import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/app/[locale]/(marketing)/login/_components/LoginForm";
import LoginHeader from "@/app/[locale]/(marketing)/login/_components/LoginHeader";
import LoginFooter from "./_components/LoginFooter";
import { ThemeSwitcher } from "@/components/switchers/ThemeSwitcher";
import { LocaleSwitcher } from "@/components/switchers/LocaleSwitcher";
import { getUserData } from "@/actions/GetUserData";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Log in | Open Studio",
  description: "Log in to Open Studio.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  const user = await getUserData();

  if (user?.email) {
    redirect("/welcome");
  }
  return (
    <Suspense>
      <main className="flex flex-col gap-3 justify-center items-center min-h-screen w-full p-4 md:p-6">
        <div className="absolute top-0 left-0 w-full flex justify-end">
          <div className="flex items-center gap-2 max-w-7xl p-4 md:p-6">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <LoginHeader />
          <div className="mt-4">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <LoginFooter />
        </div>
      </main>
    </Suspense>
  );
}
