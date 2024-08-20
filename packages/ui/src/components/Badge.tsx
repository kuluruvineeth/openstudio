import { ForwardedRef, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../lib/utils";

export type Color = VariantProps<typeof badgeVariants>["color"];

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      color: {
        gray: "bg-gray-50 text-gray-600 ring-gray-500/10",
        red: "bg-red-50 text-red-700 ring-red-600/10", // QUESTION
        yellow: "bg-yellow-50 text-yellow-800 ring-yellow-600/20", // NEUTRAL, COLLABORATION_OPPORTUNITY
        green: "bg-green-50 text-green-700 ring-green-600/10", // POSITIVE, ENGAGEMENT
        lightgreen: "bg-green-100 text-green-800 ring-green-700/10", // APPRECIATION
        lightblue: "bg-blue-100 text-blue-700 ring-blue-600/10", // SUPPORT
        orange: "bg-orange-50 text-orange-700 ring-orange-600/10", // HUMOROUS, SPAM
        darkred: "bg-red-800 text-red-100 ring-red-900/10", // OFFENSIVE
        teal: "bg-teal-50 text-teal-700 ring-teal-600/10", // COLLABORATION_OPPORTUNITY
        navy: "bg-blue-900 text-blue-100 ring-blue-900/10", // EDUCATIONAL
        purple: "bg-purple-50 text-purple-700 ring-purple-600/10", // CONSTRUCTIVE_CRITICISM
        violet: "bg-purple-50 text-purple-700 ring-purple-600/10", // PERSONAL_STORY
        blue: "bg-blue-50 text-blue-700 ring-blue-600/10", // INFORMATIVE
      },
    },
  },
);

// https://www.radix-ui.com/docs/primitives/guides/composition
export const Badge = forwardRef(
  (
    props: { children: React.ReactNode; color: Color; className?: string },
    ref: ForwardedRef<HTMLSpanElement | null>,
  ) => {
    const { color, className, ...rest } = props;
    return (
      <span
        ref={ref}
        {...rest}
        className={cn(badgeVariants({ color, className }))}
      >
        {props.children}
      </span>
    );
  },
);
Badge.displayName = "Badge";
