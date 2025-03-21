"use client";

import { Send, Sparkles } from "lucide-react";
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
      return data
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const onSubmit = (values: formSchemaType) => mutate(values);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"}>
          <Sparkles className="size-5 text-yellow-500" />
          Ask AI
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Ask AI for suggestions about your query!</SheetTitle>
        </SheetHeader>
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
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
              <Button type="submit">
                Send
                <Send className="size-5" />
              </Button>
            </form>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
