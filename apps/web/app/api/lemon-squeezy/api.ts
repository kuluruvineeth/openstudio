import { env } from "@/env.mjs";
import {
  lemonSqueezySetup,
  updateSubscriptionItem,
  getCustomer,
  activateLicense,
} from "@lemonsqueezy/lemonsqueezy.js";

let isSetup = false;

function setUpLemon() {
  if (!env.LEMON_SQUEEZY_API_KEY) return;
  if (isSetup) return;
  lemonSqueezySetup({ apiKey: env.LEMON_SQUEEZY_API_KEY });
  isSetup = true;
}

export async function getLemonCustomer(customerId: string) {
  setUpLemon();
  return getCustomer(customerId, { include: ["subscriptions", "orders"] });
}

export async function activateLemonLicenseKey(
  licenseKey: string,
  name: string,
) {
  setUpLemon();
  return activateLicense(licenseKey, name);
}
