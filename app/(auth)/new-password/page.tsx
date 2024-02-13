import { NewPasswordForm } from "@/components/auth/new-password-form";

export default function AuthenticationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <NewPasswordForm />
    </div>
  );
}
