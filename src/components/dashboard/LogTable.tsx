import { FileText } from "lucide-react";
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

export function LogTable({
	logs,
	filteredLogs,
	searchQuery,
	onLogSelect,
	hasFiles,
}: LogTableProps) {
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
								<TableRow>
									<TableHead className="w-[180px]">Timestamp</TableHead>
									<TableHead className="w-[100px]">Level</TableHead>
									<TableHead>Message</TableHead>
									<TableHead className="w-[150px] hidden md:table-cell">
										Source
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredLogs.map((log) => (
									<TableRow
										key={log.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => onLogSelect(log)}
									>
										<TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
											{log.timestamp || "-"}
										</TableCell>
										<TableCell>
											{log.level && (
												<Badge
													variant={
														getLevelBadgeColor(log.level) as
															| "default"
															| "secondary"
															| "destructive"
															| "outline"
													}
													className={getBadgeClassName(log.level)}
												>
													{log.level.toUpperCase()}
												</Badge>
											)}
										</TableCell>
										<TableCell className="max-w-[500px]">
											<div
												className="truncate font-mono text-sm"
												title={log.message}
											>
												{log.message}
											</div>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground hidden md:table-cell truncate max-w-[150px]">
											{log.sourceFile}
										</TableCell>
									</TableRow>
								))}
								{filteredLogs.length === 0 && (
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
