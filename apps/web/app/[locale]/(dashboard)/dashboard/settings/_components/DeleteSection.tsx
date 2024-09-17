"use client";

import { FormSection, FormSectionLeft } from "@openstudio/ui/components/Form";
import { Input } from "@openstudio/ui/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@openstudio/ui/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@openstudio/ui/components/ui/dialog";
import { Button } from "@openstudio/ui/components/Button";
import Warning from "@/components/Warning";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountAction } from "@/utils/actions/user";
import { handleActionResult } from "@/utils/server-action";
import { logOut } from "@/utils/user";
export function DeleteSection() {
  const deleteAccountSchema = z.object({
    email: z.string().email(),
  });

  type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
  const form = useForm<DeleteAccountSchema>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      email: "",
    },
  });
  //TODO: Delete functionality to be implemented
  return (
    <FormSection>
      <FormSectionLeft
        title="Delete account"
        description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently. Once the account and data are deleted, there is no way to recover them."
      />

      <Form {...form}>
        <form onSubmit={() => {}} className="space-y-4 w-full max-w-sm">
          <div className="space-y-2 sm:space-y-4  w-full">
            <FormField
              //   control={any}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-muted-foreground uppercase text-xs">
                    DELETE MY ACCOUNT AND DATA
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Type Your Email.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                disabled={!form.formState.isValid}
                color={"red"}
                className=""
                type="button"
              >
                Yes, delete my account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Are You Sure you want to delete your account?
                </DialogTitle>
                <DialogDescription>Think</DialogDescription>
              </DialogHeader>

              <Warning>
                <p>DELETE WARNING</p>
              </Warning>

              <Button
                disabled={true}
                onClick={async () => {
                  const result = await deleteAccountAction();
                  handleActionResult(result, "Account deleted!");
                  await logOut();
                }}
                size={"lg"}
                color={"red"}
              >
                <p>DELETE</p>
              </Button>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </FormSection>
  );
}
