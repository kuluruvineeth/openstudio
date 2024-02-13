import { NewVerificationForm } from "@/components/auth/new-verification-form";

export default function AuthenticationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <NewVerificationForm />
    </div>
  );
}
