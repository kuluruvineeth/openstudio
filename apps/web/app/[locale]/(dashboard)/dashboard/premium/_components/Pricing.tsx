"use client";

import { Label, Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";
import {
  frequencies,
  lifetimeFeatures,
  pricingAdditionalChannel,
  tiers,
} from "./config";
import { cn } from "@openstudio/ui/lib/utils";
import { Tag } from "@openstudio/ui/components/Tag";
import { CheckIcon, CreditCardIcon } from "lucide-react";
import { usePremium } from "./PremiumAlert";
import { getUserTier } from "@/actions/premium";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Button } from "@openstudio/ui/components/Button";
import { env } from "@/env.mjs";
import { AlertWithButton } from "@openstudio/ui/components/Alert";

export function Pricing() {
  const { isPremium, data, isLoading, error } = usePremium();
  const [frequency, setFrequency] = useState(frequencies[1]);

  const premiumTier = getUserTier(data?.premium);
  return (
    <LoadingContent loading={isLoading} error={error}>
      <div
        id="pricing"
        className="relative isolate mx-auto max-w-7xl bg-white px-6 pt-10 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 className="font-cal text-base leading-7 text-red-600">Pricing</h2>
          <p className="mt-2 font-cal text-4xl text-gray-900 sm:text-5xl">
            Try for free, affordable paid plans
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          No hidden fees. Cancel anytime.
        </p>

        {isPremium && (
          <div className="mt-8 text-center">
            <Button
              link={{
                href: `https://${env.NEXT_PUBLIC_LEMON_STORE_ID}.lemonsqueezy.com/billing`,
                target: "_blank",
              }}
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Manage subscription
            </Button>
          </div>
        )}

        <div className="mt-16 flex items-center justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className={
              "grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            }
          >
            <Label className={"sr-only"}>Payment frequency</Label>
            {frequencies.map((option) => (
              <Radio
                key={option.value}
                value={option}
                className={({ checked }) =>
                  cn(
                    checked ? "bg-black text-white" : "text-gray-500",
                    "cursor-pointer rounded-full px-2.5 py-1",
                  )
                }
              >
                <span>{option.label}</span>
              </Radio>
            ))}
          </RadioGroup>

          <div className="ml-1">
            <Badge>Save up to 40%</Badge>
          </div>
        </div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier, tierIdx) => {
            const isCurrentPlan =
              tier.tiers?.[frequency?.value!] === premiumTier;

            const user = data;

            const href = user
              ? isCurrentPlan
                ? "#"
                : buildLemonUrl(
                    attachUserInfo(tier.href[frequency?.value!], {
                      id: user.id,
                      email: user.email!,
                      name: user.name,
                    }),
                  )
              : "/login?next=/premium"; //TODO: handle next query param
            return (
              <div
                key={tier.name}
                className={cn(
                  "rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10",
                  tierIdx === 1 || tierIdx === 2
                    ? "lg:z-10 lg:rounded-b-none"
                    : "lg:mt-8",
                  tierIdx === 0 ? "lg:rounded-r-none" : "",
                  tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.name}
                      className={cn(
                        tier.mostPopular ? "text-red-600" : "text-gray-900",
                        "font-cal text-lg leading-8",
                      )}
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? <Badge>Most popular</Badge> : null}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${tier.price[frequency!.value]}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      {frequency?.priceSuffix}
                    </span>

                    {!!tier.discount?.[frequency!.value] && (
                      <Badge>
                        <span className="tracking-wide">
                          SAVE {tier.discount[frequency!.value].toFixed(0)}%
                        </span>
                      </Badge>
                    )}
                  </p>
                  {tier.priceAdditional ? (
                    <p>
                      +${formatPrice(tier.priceAdditional[frequency!.value])}{" "}
                      for each additional youtube channel
                    </p>
                  ) : (
                    <div className="mt-16" />
                  )}
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-red-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  aria-describedby={tier.name}
                  className={cn(
                    tier.mostPopular
                      ? "bg-red-600 text-white shadow-sm hover:bg-red-500"
                      : "text-red-600 ring-1 ring-inset ring-red-200 hover:ring-red-300",
                    "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
                  )}
                >
                  {isCurrentPlan ? "Current plan" : tier.cta}
                </a>
              </div>
            );
          })}
        </div>

        <LifetimePricing />
      </div>
    </LoadingContent>
  );
}

function LifetimePricing(props: {
  user?: { id: string; email?: string | null; name?: string | null };
  affiliateCode?: string | null;
}) {
  const { user, affiliateCode } = props;

  return (
    <div className="bg-white py-4 sm:py-8">
      <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="flex items-center font-cal text-2xl text-gray-900">
            Lifetime access
            <div className="ml-4">
              <Tag variant="red">Limited Time Offer</Tag>
            </div>
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Get lifetime access to Open Studio Business for a one-time payment.
            <br />
            Includes $100 in AI credits.
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none font-cal text-sm leading-6 text-red-600">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
          >
            {lifetimeFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-red-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-gray-600">
                Lifetime access to Open Studio
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  299
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  USD
                </span>
              </p>
              <a
                href={""}
                target="_blank"
                className="mt-10 block w-full rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                rel="noreferrer"
              >
                {"Get lifetime access"}
              </a>
              <p className="mt-6 text-xs leading-5 text-gray-600">
                per additional youtube channel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-full bg-red-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-red-600">
      {children}
    </p>
  );
}

// $5.5 => $5.50
// $10 => $10
function formatPrice(price: number) {
  if (price - Math.floor(price) > 0) return price.toFixed(2);
  return price;
}

function attachUserInfo(
  url: string,
  user: { id: string; email: string; name?: string | null },
) {
  if (!user) return url;

  return `${url}?checkout[custom][user_id]=${user.id}&checkout[email]=${user.email}&checkout[name]=${user.name}`;
}

function buildLemonUrl(url: string, affiliateCode?: string | null) {
  if (!affiliateCode) return url;
  const newUrl = `${url}?aff_ref=${affiliateCode}`;
  return newUrl;
}
