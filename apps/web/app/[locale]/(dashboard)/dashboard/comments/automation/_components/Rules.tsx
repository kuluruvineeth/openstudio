"use client";

import { RulesResponse } from "@/app/api/user/rules/route";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { PremiumAlertWithData } from "../../../premium/_components/PremiumAlert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Button } from "@openstudio/ui/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@openstudio/ui/components/ui/table";
import { Actions } from "./Actions";
import { Toggle } from "@openstudio/ui/components/Toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@openstudio/ui/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { isActionError } from "@/utils/error";
import { toastError } from "@openstudio/ui/components/Toast";
import { deleteRuleAction, setRuleAutomatedAction } from "@/actions/Rule";

export function Rules() {
  const { data, isLoading, error, refetch } = useQuery<RulesResponse>({
    queryKey: ["rules"],
    queryFn: async () => {
      const response = await api.get<RulesResponse>(`/user/rules`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div>
      {data && data.length > 0 && (
        <div className="my-2">
          <PremiumAlertWithData />
        </div>
      )}

      <Card>
        <LoadingContent loading={isLoading} error={error}>
          {data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="text-center">Automated</TableHead>
                  <TableHead>
                    <span className="sr-only">User Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/comments/automation/rule/${rule.id}`}
                      >
                        {rule.name}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {rule.instructions}
                    </TableCell>
                    <TableCell>{rule.type}</TableCell>
                    <TableCell>
                      <Actions actions={rule.action} />
                    </TableCell>
                    <TableCell>
                      <Toggle
                        enabled={rule.automate}
                        name="automate"
                        onChange={async () => {
                          const result = await setRuleAutomatedAction(
                            rule.id,
                            !rule.automate,
                          );
                          if (isActionError(result)) {
                            toastError({
                              description:
                                "There was an error updating your rule. " +
                                result.error,
                            });
                          }
                          refetch();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size={"icon"}
                            variant={"ghost"}
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/comments/automation/rule${rule.id}`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              const yes = confirm(
                                "Are you sure you want to delete this rule?",
                              );
                              if (yes) {
                                const result = await deleteRuleAction(rule.id);
                                if (isActionError(result)) {
                                  toastError({
                                    description:
                                      "There was an error deleting your rule. " +
                                      result.error,
                                  });
                                }
                                refetch();
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Create your first automation</CardTitle>
                <CardDescription>
                  Automations are the rules that will be applied to your
                  incoming comments.
                </CardDescription>
                <CardContent>
                  <Button asChild variant={"outline"}>
                    <Link href={"/dashboard/comments/automation/create"}>
                      Create Automation
                    </Link>
                  </Button>
                </CardContent>
              </CardHeader>
            </>
          )}
        </LoadingContent>
      </Card>
    </div>
  );
}
