"use client";

import * as React from "react";
import {
  BadgeDollarSign,
  BarChart,
  Briefcase,
  Building,
  CreditCard,
  DollarSign,
  HelpCircle,
  Layers,
  LayoutDashboard,
  PiggyBank,
  Repeat2,
  Settings,
  Sparkle,
  Sprout,
  Tag,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "@/app/(dashboard)/dashboard/_components/workspace-switcher";
import { Nav } from "./nav";
import { VideoGallery } from "@/components/fileupload/video-gallery";
import axios from "axios";
import { clearTranscriptionItems } from "@/lib/transciption-helper";
import TranscriptionItem from "./transcription-item";
import TranscriptionEditor from "./transcription-editor";
import ResultVideo from "./result-video";

// import { Mail } from "../data";
// import { useMail } from "../use-mail";
// import { Nav } from "./nav";
// import { CardsStats } from "./stats";
// import { TopCategoriesTable } from "./top-categories-table";
// import { TransactionsReviewTable } from "./transaction-review-table";

interface DashboardProps {
  accounts?: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails?: any[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  videos: any;
}

const API_BASE_URL = "/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function VideosDashboard({
  accounts,
  mails,
  defaultLayout = [20, 40, 40],
  defaultCollapsed = false,
  navCollapsedSize,
  videos,
}: DashboardProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  // const [mail] = useMail();

  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = React.useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = React.useState<
    any[]
  >([]);

  React.useEffect(() => {
    getTranscription();
  }, []);

  function getTranscription() {
    setIsFetchingInfo(true);
    axios.get("/api/transcribe?filename=" + "os.mp4").then((response) => {
      setIsFetchingInfo(false);
      const status = response.data?.status;
      const transcription = response.data?.transcription;
      if (status === "IN_PROGRESS") {
        setIsTranscribing(true);
        setTimeout(getTranscription, 3000);
      } else {
        setIsTranscribing(false);

        setAwsTranscriptionItems(
          clearTranscriptionItems(transcription.results.items)
        );
      }
    });
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[1200px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          //@ts-ignore
          onCollapse={(collapsed) => {
            setIsCollapsed(!isCollapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              isCollapsed
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center px-2",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <WorkspaceSwitcher isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Dashboard",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
                link: "/dashboard",
              },
              {
                title: "Video Gallery",
                label: "9",
                icon: Layers,
                variant: "default",
                link: "/dashboard/video-gallery",
              },
              {
                title: "Video Captions",
                label: "9",
                icon: Layers,
                variant: "ghost",
                link: "/dashboard/video-caption",
              },
              {
                title: "Transactions",
                label: "9",
                icon: Layers,
                variant: "ghost",
                link: "/dashboard/transactions",
              },
              {
                title: "Accounts",
                label: "3",
                icon: CreditCard,
                variant: "ghost",
                link: "/dashboard/accounts",
              },
              {
                title: "Investments",
                label: "",
                icon: BarChart,
                variant: "ghost",
                link: "/dashboard/investments",
              },
              {
                title: "Categories",
                label: "",
                icon: Tag,
                variant: "ghost",
                link: "/dashboard/categories",
              },
              {
                title: "Recurring",
                label: "",
                icon: Repeat2,
                variant: "ghost",
                link: "/dashboard/recurring",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Ai Magic",
                label: "",
                icon: Sparkle,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Save Money",
                label: "",
                icon: Wallet,
                variant: "ghost",
                link: "/dashboard/savemoney",
              },
              {
                title: "Grow Assets",
                label: "",
                icon: Sprout,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Credit Card",
                label: "972",
                icon: CreditCard,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Credit Card",
                label: "342",
                icon: CreditCard,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Checking",
                label: "128",
                icon: DollarSign,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Savings",
                label: "8",
                icon: PiggyBank,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Banking",
                label: "21",
                icon: Building,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Funds",
                label: "483",
                icon: Briefcase,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Coinbase",
                label: "145",
                icon: BadgeDollarSign,
                variant: "ghost",
                link: "/dashboard/",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Get help",
                label: "",
                icon: HelpCircle,
                variant: "ghost",
                link: "/dashboard/",
              },
              {
                title: "Settings",
                label: "",
                icon: Settings,
                variant: "ghost",
                link: "/dashboard/settings",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <ScrollArea className="h-screen">
            <div className="flex h-[52px] items-center px-4 py-2">
              <h1 className="text-xl font-bold">Video Captions</h1>
            </div>
            <Separator />

            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form></form>
              Captions
              {isTranscribing && <div>Transcribing your video...</div>}
              {isFetchingInfo && <div>Fetching information...</div>}
            </div>
            {/* <TranscriptionEditor
              awsTranscriptionItems={awsTranscriptionItems}
              setAwsTranscriptionItems={setAwsTranscriptionItems}
            /> */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-16">
              <div className="">
                <h2 className="text-2xl mb-4 text-white/60">Transcription</h2>
                <TranscriptionEditor
                  awsTranscriptionItems={awsTranscriptionItems}
                  setAwsTranscriptionItems={setAwsTranscriptionItems}
                />
              </div>
              <div>
                <h2 className="text-2xl mb-4 text-white/60">Result</h2>
                <ResultVideo
                  filename={"os.mp4"}
                  transcriptionItems={awsTranscriptionItems}
                />
              </div>
            </div>

            {/* <CardsStats /> */}
            {/* <div className="ml-6 mt-6 flex gap-4"> */}
            <div className="mx-6 mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {/* <TransactionsReviewTable />
              <TopCategoriesTable /> */}
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
