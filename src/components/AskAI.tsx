"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { CodeBlock } from "./aceternityui/CodeBlock";
import { Skeleton } from "./ui/skeleton";

export const formSchema = z.object({
  message: z.string({ message: "Message is required" }),
});
type formSchemaType = z.infer<typeof formSchema>;

export default function AskAI() {
  const form = useForm<formSchemaType>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { data, mutate, isPending } = useMutation({
    mutationKey: ["ask-ai"],
    mutationFn: async (values: formSchemaType) => {
      const response = await fetch("/api/query-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQueryDescription: values.message }),
      });

      const data = await response.json();
      return data;
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onSubmit = (values: formSchemaType) => mutate(values);
  return (
    <Sheet>
      <SheetTrigger>
        <div className="fixed bottom-4 right-4 size-12 rounded-full border border-input/50 bg-white dark:bg-neutral-900/70 p-2 flex items-center gap-x-1.5">
          <Sparkles className="w-full h-full text-yellow-500 fill-yellow-500" />
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-x-2">
            <Sparkles className="size-6 text-yellow-500 fill-yellow-500" />
            Ask AI for suggestions!
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          {isPending && <Skeleton className="w-full h-[250px]" />}
          {data && (
            <CodeBlock
              language="sql"
              filename="filename.sql"
              highlightLines={[9, 13, 14, 18]}
              code={data.query}
            />
          )}
        </div>
        <SheetFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-3"
            >
              <FormField
                control={form.control}
                name="message"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        placeholder="Ask AI for suggestions..."
                        className="h-20 resize-none"
                        {...form.register("message")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <>
                    Send
                    <Send className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
