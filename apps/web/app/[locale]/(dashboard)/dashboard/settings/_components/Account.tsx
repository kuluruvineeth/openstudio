import { FormWrapper } from "@openstudio/ui/components/Form";
import { DeleteSection } from "./DeleteSection";
import { ModelSection } from "./ModelSection";
import { PromptSection } from "./PromptSection";

export function Account() {
  return (
    <FormWrapper>
      <PromptSection />
      <ModelSection />
      <DeleteSection />
    </FormWrapper>
  );
}
