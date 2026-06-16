import {
	type Column,
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ResizablePanel } from "@/components/ui/resizable";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { LogEntry } from "@/lib/log-parser";
import { getBadgeClassName, getLevelBadgeColor } from "./utils";

interface LogTableProps {
	logs: LogEntry[];
	filteredLogs: LogEntry[];
	searchQuery: string;
	onLogSelect: (log: LogEntry) => void;
	hasFiles: boolean;
}

function SortIcon({ column }: { column: Column<LogEntry> }) {
	const sorted = column.getIsSorted();
	if (sorted === "asc") return <ChevronUp className="h-3 w-3" />;
	if (sorted === "desc") return <ChevronDown className="h-3 w-3" />;
	return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
}

const columns: ColumnDef<LogEntry>[] = [
	{
		id: "timestamp",
		header: "Timestamp",
		accessorFn: (row) => row.timestamp ?? "",
		cell: ({ row }) => (
			<span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
				{row.original.timestamp || "-"}
			</span>
		),
	},
	{
		accessorKey: "level",
		header: "Level",
		cell: ({ row }) =>
			row.original.level ? (
				<Badge
					variant={
						getLevelBadgeColor(row.original.level) as
							| "default"
							| "secondary"
							| "destructive"
							| "outline"
					}
					className={getBadgeClassName(row.original.level)}
				>
					{row.original.level.toUpperCase()}
				</Badge>
			) : null,
	},
	{
		accessorKey: "message",
		header: "Message",
		cell: ({ row }) => (
			<div
				className="truncate font-mono text-sm max-w-[500px]"
				title={row.original.message}
			>
				{row.original.message}
			</div>
		),
	},
	{
		accessorKey: "sourceFile",
		header: "Source",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground truncate block max-w-[150px]">
				{row.original.sourceFile}
			</span>
		),
	},
];

const columnClassNames: Record<string, string> = {
	timestamp: "w-[180px]",
	level: "w-[100px]",
	message: "",
	sourceFile: "w-[150px] hidden md:table-cell",
};

export function LogTable({
	logs,
	filteredLogs,
	searchQuery,
	onLogSelect,
	hasFiles,
}: LogTableProps) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "timestamp", desc: false },
	]);

	const table = useReactTable({
		data: filteredLogs,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableSortingRemoval: true,
	});

	return (
		<ResizablePanel defaultSize={80}>
			<div className="h-full flex flex-col">
				<div className="p-2 border-b bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
					<span>
						Displaying {filteredLogs.length} of {logs.length} events
					</span>
					{hasFiles && (
						<span>
							Latest event: {logs[logs.length - 1]?.timestamp || "N/A"}
						</span>
					)}
				</div>

				{logs.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
						<FileText className="h-16 w-16 mb-4 opacity-20" />
						<h3 className="text-lg font-semibold">No logs to display</h3>
						<p>Upload a .jsonl file to get started.</p>
					</div>
				) : (
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="bg-muted/50 sticky top-0 z-10">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												className={columnClassNames[header.id] ?? ""}
												onClick={
													header.column.getCanSort()
														? () => header.column.toggleSorting()
														: undefined
												}
												style={{
													cursor: header.column.getCanSort()
														? "pointer"
														: "default",
												}}
											>
												<div className="flex items-center gap-1 select-none">
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{header.column.getCanSort() && (
														<SortIcon column={header.column} />
													)}
												</div>
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => onLogSelect(row.original)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className={
													cell.column.id === "sourceFile"
														? "hidden md:table-cell"
														: undefined
												}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))}
								{table.getRowModel().rows.length === 0 && (
									<TableRow>
										<TableCell colSpan={4} className="h-24 text-center">
											No results found for "{searchQuery}"
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</ResizablePanel>
	);
}
