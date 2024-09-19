import { buttonVariants } from "@openstudio/ui/components/ui/button";
import { cn } from "@openstudio/ui/lib/utils";
import Link from "next/link";

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
        <div>
          <div>
            <Link
              className={cn(
                buttonVariants(),
                "gap-2 whitespace-pre hidden md:flex",
                "group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-sm",
              )}
              href={""}
            >
              Star on Github
              <div>{stars}</div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
