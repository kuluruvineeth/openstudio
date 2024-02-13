import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className, "border-t")}>
      <div className="container flex h-12 flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4 md:gap-2 md:px-0">
          <Icons.logo className="mr-2 h-6 w-6" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Kuluru Vineeth
            </a>
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
