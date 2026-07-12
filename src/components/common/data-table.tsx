import type { ReactNode } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface DataTableColumn<T> { id: string; header: ReactNode; cell: (row: T) => ReactNode; className?: string }
interface DataTableProps<T> { data: T[]; columns: DataTableColumn<T>[]; getRowId: (row: T) => string; empty?: ReactNode }
export function DataTable<T>({ data, columns, getRowId, empty }: DataTableProps<T>) {
  if (!data.length) return <>{empty}</>
  return <Table><TableHeader><TableRow>{columns.map((column) => <TableHead key={column.id} className={column.className}>{column.header}</TableHead>)}</TableRow></TableHeader><TableBody>{data.map((row) => <TableRow key={getRowId(row)}>{columns.map((column) => <TableCell key={column.id} className={column.className}>{column.cell(row)}</TableCell>)}</TableRow>)}</TableBody></Table>
}
