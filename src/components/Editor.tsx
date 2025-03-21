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
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { runQuery } from "@/lib/actions";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import QueryResult from "./QueryResult";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Loader2, Sparkles } from "lucide-react";
import AskAI from "./AskAI";

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
      return result;
    },
    onError: (err) => {
      toast.error("Something went wrong!");
    },
  });

  const onSubmit = (values: editorSchemaType) => mutate(values);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="query"
          render={() => (
            <FormItem>
              <FormLabel>SQL Query</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="Write your query here..."
                  {...form.register("query")}
                  className="w-full h-full resize-y min-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AskAI />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            <span>Run Query</span>
          )}
        </Button>

        <div className="mt-8">
          {isPending ? (
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-[100px] h-10" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          ) : error && !isPending ? (
            <div className="flex flex-col gap-y-2">
              <h4 className="text-2xl font-bold text-destructive">
                Something went wrong :/
              </h4>
              <p>{error.message}</p>
            </div>
          ) : !queryResult || !queryResult.length ? (
            <h1>No results</h1>
          ) : queryResult.length === 0 ? (
            <div>
              <h1>0 results</h1>
            </div>
          ) : (
            queryResult.length > 0 && <QueryResult result={queryResult} />
          )}
        </div>
      </form>
    </Form>
  );
}
