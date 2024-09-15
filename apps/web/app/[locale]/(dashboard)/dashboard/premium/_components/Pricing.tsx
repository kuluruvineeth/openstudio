"use client";
import {
  lifetimeFeatures,
} from "./config";
import { Tag } from "@openstudio/ui/components/Tag";
import { CheckIcon, CreditCardIcon } from "lucide-react";
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
