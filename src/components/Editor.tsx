"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { runQuery } from "@/lib/actions";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import QueryResult from "./QueryResult";
import { toast } from "sonner";;
import { Loader2 } from "lucide-react";
import { Terminal } from "./magicui/terminal";

const queryRegex = /^(SELECT|WITH)\s+/i; // Permette solo SELECT e WITH

const editorSchema = z.object({
  query: z
    .string({ message: "SQL Query is required" })
    .regex(queryRegex, { message: "Only SELECT or WITH queries are allowed" }),
});

type editorSchemaType = z.infer<typeof editorSchema>;

export default function Editor() {
  const form = useForm<editorSchemaType>({
    defaultValues: {
      query: "",
    },
    resolver: zodResolver(editorSchema),
  });

  const {
    mutate,
    data: queryResult,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["runQuery"],
    mutationFn: async (values: editorSchemaType) => {
      const result = await runQuery(values.query);
      console.log(result);
      return result;
    },
    onError: (err) => {
      toast.error("Something went wrong!");
    },
  });

  const onSubmit = (values: editorSchemaType) => mutate(values);

  return (
    <section id="editor" className="flex flex-col gap-y-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-y-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <Terminal className="w-full min-h-[350px] max-w-3xl mx-auto">
              <FormField
                control={form.control}
                name="query"
                render={() => (
                  <FormItem className="min-h-full">
                    <FormLabel className="sr-only">SQL Query</FormLabel>
                    <FormControl>
                      <textarea
                        disabled={isPending}
                        placeholder="Write your query here..."
                        {...form.register("query")}
                        className="w-full min-h-[280px] resize-none border-none focus:shadow-none focus-visible:outline-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Terminal>

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <span>Run Query</span>
              )}
            </Button>
          </div>

          <QueryResult
            result={queryResult}
            error={error}
            isPending={isPending}
          />
        </form>
      </Form>
    </section>
  );
}
