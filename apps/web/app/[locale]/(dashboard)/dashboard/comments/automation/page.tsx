import { Button } from "@openstudio/ui/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@openstudio/ui/components/ui/tabs";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BulkRunRules } from "./_components/BulkRunRules";
import { Rules } from "./_components/Rules";
import { Pending } from "./_components/Pending";
import { History } from "./_components/History";
import { TestRules, TestRulesContent } from "./_components/TestRules";

export default async function AutomationPage() {
  return (
    <Suspense>
      <Tabs defaultValue="automations">
        <div className="content-container flex shrink-0 flex-col justify-between gap-x-4 space-y-2 border-b border-gray-200 bg-white py-2 shadow-sm md:flex-row md:gap-x-6 md:space-y-0">
          <div className="w-full overflow-x-auto">
            <TabsList>
              <TabsTrigger value="automations">Automations</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex gap-2">
            <BulkRunRules />

            <Button asChild>
              <Link href={"/dashboard/comments/automation/create"}>
                <SparklesIcon className="mr-2 hidden h-4 w-4 md:block" />
                Create Automation
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="automations" className="content-container mb-10">
          <Rules />
        </TabsContent>
        <TabsContent value="pending" className="content-container mb-10">
          <Pending />
        </TabsContent>
        <TabsContent value="history" className="content-container mb-10">
          <History />
        </TabsContent>
        <TabsContent value="test" className="content-container mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Test your rules</CardTitle>
              <CardDescription>
                Check how your rules perform against previous comments or custom
                content.
              </CardDescription>
            </CardHeader>
            {/* <TestRulesContent /> */}
            <TestRules />
          </Card>
        </TabsContent>
        <TabsContent value="groups" className="content-container mb-10">
          Groups
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
