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
  
  return (
    <Table className="overflow-x-auto bg-background rounded-lg">
      <TableCaption>{result.length} results</TableCaption>
      <TableHeader>
        <TableRow>
          {keys.map((key) => (
            <TableHead key={key}>{key}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((row, i) => (
          <TableRow key={i}>
            {keys.map((key) => (
              <TableCell key={key}>{row[key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
