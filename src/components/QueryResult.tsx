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
  result: any;
}

export default function QueryResult({ result }: QueryResultProps) {
  const keys = Object.keys(result[0]);

  if(!result || !result.length) return (
    <div className="flex items-center justify-center w-full h-full">
        <h1>0 results</h1>
    </div>
  )

  return (
    <div className="flex flex-col gap-y-2">
        <h2 className="text-2xl font-bold">Query Results</h2>
        <Table className="overflow-x-auto">
        <TableCaption>{result.length} results</TableCaption>
      <TableHeader>
        <TableRow>
          {keys.map((key, i) => (
            <TableHead key={i}>{key}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((row: any, i: number) => (
          <TableRow key={i}>
            {keys.map((key, i) => (
              <TableCell key={i}>{row[key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
