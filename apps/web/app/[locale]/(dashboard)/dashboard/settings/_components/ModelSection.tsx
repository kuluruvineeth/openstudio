"use client";

import { FormSection, FormSectionLeft } from "@openstudio/ui/components/Form";
import { Select } from "@openstudio/ui/components/Select";

export function ModelSection() {
  return (
    <FormSection>
      <FormSectionLeft
        title="AI Model"
        description="Choose your AI model and use your own API key."
      />
      <ModelSectionForm />
    </FormSection>
  );
}

//TODO: Placeholders for now

function ModelSectionForm(props: {
  aiProvider?: string | null;
  aiModel?: string | null;
  aiApiKey?: string | null;
}) {
  return (
    <form onSubmit={() => {}} className="space-y-4">
      <Select name="aiProvider" label="Provider" options={[]} />
    </form>
  );
}
