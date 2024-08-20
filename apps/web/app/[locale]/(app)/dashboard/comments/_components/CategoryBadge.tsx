import { Badge, Color } from "@openstudio/ui/components/Badge";
import { capitalCase } from "change-case";

const categoryColors: Record<string, Color> = {
  POSITIVE: "green",
  NEGATIVE: "red",
  NEUTRAL: "gray",
  SPAM: "orange",
  OFFENSIVE: "darkred",
  INFORMATIVE: "blue",
  ENGAGEMENT: "green",
  CONSTRUCTIVE_CRITICISM: "purple",
  QUESTION: "yellow",
  APPRECIATION: "lightgreen",
  COLLABORATION_OPPORTUNITY: "teal",
  SUPPORT: "lightblue",
  HUMOROUS: "orange",
  EDUCATIONAL: "navy",
  PERSONAL_STORY: "violet",
  OTHER: "gray",
};

export function CategoryBadge(props: { category?: string }) {
  const { category } = props;

  return (
    <Badge
      color={category ? categoryColors[category] || "gray" : "gray"}
      className="max-w-[100px] overflow-hidden"
    >
      {capitalCase(category || "Uncategorized")}
    </Badge>
  );
}
