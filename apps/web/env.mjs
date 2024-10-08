import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    LOG_ZOD_ERRORS: z.coerce.boolean().optional(),
    TINYBIRD_TOKEN: z.string().min(1),
    TINYBIRD_BASE_URL: z.string().default("https://api.us-east.tinybird.co/"),
    ENCRYPT_SECRET: z.string().optional(),
    ENCRYPT_SALT: z.string().optional(),
BEDROCK_ACCESS_KEY: z.string().optional(),
    BEDROCK_SECRET_KEY: z.string().optional(),
    BEDROCK_REGION: z.string().default("us-east-1"),
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().optional(),
    UPSTASH_REDIS_URL: z.string().min(1),
    UPSTASH_REDIS_TOKEN: z.string().min(1),
    REDIS_URL: z.string().optional(),
    REDIS_TOKEN: z.string().optional(),
    LEMON_SQUEEZY_SIGNING_SECRET: z.string().optional(),
    LEMON_SQUEEZY_API_KEY: z.string().optional(),
    POSTHOG_API_SECRET: z.string().optional(),
    POSTHOG_PROJECT_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_LEMON_STORE_ID: z.string().nullish().default("openstudio"),

    //lemon plans
    //basic
    NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_BASIC_ANNUALLY_VARIANT_ID: z.coerce.number().default(0),
    //pro
    NEXT_PUBLIC_PRO_MONTHLY_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_PRO_ANNUALLY_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID: z.coerce.number().default(0),
    //business
    NEXT_PUBLIC_BUSINESS_MONTHLY_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_BUSINESS_ANNUALLY_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_BUSINESS_MONTHLY_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_BUSINESS_ANNUALLY_VARIANT_ID: z.coerce.number().default(0),
    //lifetime
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_LIFETIME_VARIANT_ID: z.coerce.number().default(0),
    NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_PAYMENT_LINK: z.string().default(""),
    NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_VARIANT_ID: z.coerce.number().default(0),

    NEXT_PUBLIC_ENTERPRISE_PAYMENT_LINK: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_LEMON_STORE_ID: process.env.NEXT_PUBLIC_LEMON_STORE_ID,
    //pro
    NEXT_PUBLIC_PRO_MONTHLY_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_PRO_MONTHLY_PAYMENT_LINK,
    NEXT_PUBLIC_PRO_ANNUALLY_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_PRO_ANNUALLY_PAYMENT_LINK,
    NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID,
    NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID,
    //business
    NEXT_PUBLIC_BUSINESS_MONTHLY_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PAYMENT_LINK,
    NEXT_PUBLIC_BUSINESS_ANNUALLY_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_BUSINESS_ANNUALLY_PAYMENT_LINK,
    NEXT_PUBLIC_BUSINESS_MONTHLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_VARIANT_ID,
    NEXT_PUBLIC_BUSINESS_ANNUALLY_VARIANT_ID:
      process.env.NEXT_PUBLIC_BUSINESS_ANNUALLY_VARIANT_ID,
    //lifetime
    NEXT_PUBLIC_LIFETIME_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_LIFETIME_PAYMENT_LINK,
    NEXT_PUBLIC_LIFETIME_VARIANT_ID: process.env.NEXT_PUBLIC_LIFETIME_PLAN_ID,
    NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_PAYMENT_LINK,
    NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_VARIANT_ID:
      process.env.NEXT_PUBLIC_LIFETIME_EXTRA_SEATS_VARIANT_ID,

    NEXT_PUBLIC_ENTERPRISE_PAYMENT_LINK:
      process.env.NEXT_PUBLIC_ENTERPRISE_PAYMENT_LINK,
  },
});
