import { CardWrapper } from "@/components/auth/card-wrapper";
import { Icons } from "../shared/icons";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/signin"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <Icons.warning className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
