import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { LoadingMiniSpinner } from "./Loading";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  link?: { href: string; target?: React.HTMLAttributeAnchorTarget };
  full?: boolean;
  color?: Color;
  size?: Size;
  roundedSize?: "md" | "xl" | "full";
  loading?: boolean;
}

type Color = "primary" | "white" | "red" | "blue" | "transparent";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "circle";

export const Button = (props: ButtonProps) => {
  const {
    color = "primary",
    size = "lg",
    roundedSize = "md",
    full,
    loading,
    className,
    ...rest
  } = props;

  const Component: React.ElementType = props.link ? BasicLink : "button";

  return (
    <Component
      type="button"
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap text-center font-semibold",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "disabled:cursor-default disabled:opacity-70",
        "transition-transform hover:scale-105",
        {
          xs: "px-2 py-1 text-xs",
          sm: "px-2 py-1 text-sm",
          md: "px-2.5 py-1.5 text-sm",
          lg: "px-3 py-2 text-sm",
          xl: "px-3.5 py-2.5 text-sm",
          "2xl": "px-6 py-3 text-base font-medium",
          circle: "",
        }[size],
        {
          md: "rounded-md",
          xl: "rounded-xl",
          full: "rounded-full py-4 shadow-lg",
        }[roundedSize],
        {
          "border px-4 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2":
            color !== "transparent",

          "w-full": full,

          "bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-900 ":
            color === "primary",
          "bg-red-100 text-gray-900 hover:bg-red-200 focus:ring-red-500 ":
            color === "red",
          "border border-gray-100 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200":
            color === "white",
          "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600":
            color === "blue",
        },
        className,
      )}
      {...rest}
      disabled={loading || props.disabled}
    >
      {loading && (
        <span className="mr-3">
          <LoadingMiniSpinner />
        </span>
      )}
      {rest.children}
    </Component>
  );
};

const BasicLink = (props: {
  link: {
    href: string;
    target?: React.HTMLAttributeAnchorTarget;
    rel?: string | undefined;
  };
  children: React.ReactNode;
  type?: string;
}) => {
  const {
    link: { href, target, rel },
    type, // must not be passed to the a tag or the styling doesn't work well on iOS
    children,
    ...rest
  } = props;

  return (
    <Link href={href} target={target} rel={rel} {...rest}>
      {children}
    </Link>
  );
};
