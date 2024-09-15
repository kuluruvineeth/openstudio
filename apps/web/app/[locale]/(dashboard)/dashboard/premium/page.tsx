import { Suspense } from "react";
import { Pricing } from "./_components/Pricing";

export default function Premium() {
  return (
    <Suspense>
      <div className="pb-20">
        <Pricing />
      </div>
    </Suspense>
  );
}
