import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { TopSection } from "@openstudio/ui/components/TopSection";
import { RuleForm } from "../RuleForm";

export default async function RulePage({
  params,
  searchParams,
}: {
  params: { ruleId: string };
  searchParams: { new: string };
}) {
  const session = await auth();

  if (!session?.ownerEmail) throw new Error("Not logged in");

  const supabase = await supabaseServerClient();

  const { data: rules, error } = await supabase
    .from("rule")
    .select(
      `
      id,
      type,
      name,
      instructions,
      automate,
      user_id,
      created_at,
      action (
        id,
        type,
        content,
        content_prompt,
        rule_id
      )
    `,
    )
    .eq("id", params.ruleId)
    .eq("user_id", session.userId)
    .single();

  if (error) throw new Error("Rule not found");

  const ruleWithActions = {
    ...rules,
    actions: rules.action.map((action) => ({
      content:
        typeof action.content_prompt === "string"
          ? { value: action.content_prompt, ai: true }
          : { value: action.content, ai: false },
      type: action.type,
    })),
  };

  const { action, ...rulesWithoutAction } = ruleWithActions;

  return (
    <div>
      {searchParams.new === "true" && (
        <TopSection
          title="Here are your rule settings!"
          descriptionComponent={
            <p>
              These rules were AI generated, feel free to adjust them to your
              needs.
            </p>
          }
        />
      )}
      <div className="content-container mx-auto h-full max-w-3xl">
        <RuleForm rule={rulesWithoutAction} />
      </div>
    </div>
  );
}
