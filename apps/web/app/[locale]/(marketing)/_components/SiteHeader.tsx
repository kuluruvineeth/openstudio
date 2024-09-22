import { buttonVariants } from "@openstudio/ui/components/ui/button";
import { cn } from "@openstudio/ui/lib/utils";
import Link from "next/link";
import { Icons } from "@openstudio/ui/components/Icons";
import CountingNumbers from "@openstudio/ui/components/CountingNumbers";
import { StarIcon } from "lucide-react";
import { MainNav } from "./MainNav";

export async function SiteHeader() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/kuluruvineeth/openstudio",
    {
      ...(process.env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      next: {
        revalidate: 3600,
      },
    },
  )
    .then((res) => res.json())
    .catch(() => ({ stargazers_count: 300 }));

  return (
    <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 w-full backdrop-blur bg-background border-b">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-between">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link
              className={cn(
                buttonVariants({ variant: "black" }),
                "gap-2 whitespace-pre hidden md:flex",
                "group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-sm",
              )}
              href={""}
            >
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
              <Icons.gitHub className="h-4 w-4" />
              Star on Github
              <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                <StarIcon className="h-4 w-4 group-hover:text-yellow-300 transition-all duration-300" />
                <CountingNumbers
                  value={stars}
                  className="font-medium text-white"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
