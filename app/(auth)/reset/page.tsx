import { ResetForm } from "@/components/auth/reset-form";

export default function AuthenticationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <ResetForm />
    </div>
  );
}
