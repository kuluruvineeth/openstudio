"use client";

import { FormWrapper } from "@openstudio/ui/components/Form";
import { DeleteSection } from "./DeleteSection";
import { PromptSectionForm } from "./PromptSectionForm";
import { ModelSection } from "./ModelSection";

export function Account() {
  return (
    <FormWrapper>
      <PromptSectionForm />
      <ModelSection />
      <DeleteSection />
    </FormWrapper>
  );
}
