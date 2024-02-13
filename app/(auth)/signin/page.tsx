import type { Route } from "next";
import Link from "next/link";
import { EmailSignIn } from "./email-signin";
import { OAuthSignIn } from "./oauth-signin";
import { LoginForm } from "@/components/auth/login-form";

// import { EmailSignIn } from "./email-signin";
// import { OAuthSignIn } from "./oauth-signin";

export default function AuthenticationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <LoginForm />
    </div>
  );
}
