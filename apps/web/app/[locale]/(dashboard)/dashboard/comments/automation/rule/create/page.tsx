import { RULES_EXAMPLES } from "../../create/examples";
import { RuleForm } from "../RuleForm";

export default function CreateRulePage({
  searchParams,
}: {
  searchParams: { example?: string };
}) {
  const rule =
    searchParams.example &&
    RULES_EXAMPLES[Number.parseInt(searchParams.example)]!.rule;

  return (
    <div className="content-container mx-auto w-full max-w-3xl">
      <RuleForm
        rule={
          rule || {
            name: "",
            actions: [],
            type: "AI",
          }
        }
      />
    </div>
  );
}
