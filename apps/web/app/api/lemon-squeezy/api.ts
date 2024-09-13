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
