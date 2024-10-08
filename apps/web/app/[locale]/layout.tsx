import "@openstudio/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@openstudio/ui/components/Toast";
import NextTopLoader from "nextjs-toploader";
import { QueryProvider } from "@/providers/QueryProvider";
import { StatLoaderProvider } from "@/providers/StatLoaderProvider";
import { PostHogPageview, PostHogProvider } from "@/providers/PostHogProvider";
import { Suspense } from "react";
import { QueueProvider } from "@/providers/QueueProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docs",
  description: "Generated by create turbo",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}): Promise<JSX.Element> {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <QueueProvider>
          <PostHogProvider>
            <Suspense>
              <PostHogPageview />
            </Suspense>
            <NextIntlClientProvider messages={messages}>
              <QueryProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <NextTopLoader color="#f44336" />
                  <Toaster
                    closeButton
                    richColors
                    theme="light"
                    visibleToasts={9}
                  />
                  <StatLoaderProvider> {children}</StatLoaderProvider>
                </ThemeProvider>
              </QueryProvider>
            </NextIntlClientProvider>
          </PostHogProvider>
        </QueueProvider>
      </body>
    </html>
  );
}
