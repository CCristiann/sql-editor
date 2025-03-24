"use client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface QueryResultProps {
  error: Error | null;
  result: any;
  isPending: boolean;
}

export default function QueryResult({
  result,
  error,
  isPending,
}: QueryResultProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-2xl font-bold">Query Output</h2>

      {isPending && <LoadingSkeleton />}
      {error && <ErrorMessage error={error} />}
      {!result || !result.length ? (
        <NoResults isPending={isPending} />
      ) : (
        <ResultsTable result={result} />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-10" />
      ))}
    </div>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return (
    <div className="flex flex-col gap-y-2">
      <h4 className="text-2xl font-bold text-destructive">
        Something went wrong :/
      </h4>
      <p>{error.message}</p>
    </div>
  );
}

function NoResults({ isPending }: { isPending: boolean }) {
  return (
    <div>
      <p className="text-muted-foreground">
        {isPending
          ? "Loading..."
          : "0 records found. Type your query in the editor above and hit run."}
      </p>
    </div>
  );
}

function ResultsTable({ result }: { result: any[] }) {
  const keys = Object.keys(result[0]);

  const columns: ColumnDef<{ accessoryKey: string; header: string }>[] =
    keys.map((key) => ({
      accessorKey: key,
      header: key,
    }));

  const table = useReactTable({
    data: result,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <Table className="overflow-x-auto bg-background rounded-lg">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">{`${result.length} results`}</span>
        <div className="flex items-center gap-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
