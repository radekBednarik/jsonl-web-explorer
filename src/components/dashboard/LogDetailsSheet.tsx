import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { LogEntry } from "@/lib/log-parser";
import { getBadgeClassName, getLevelBadgeColor } from "./utils";

interface LogDetailsSheetProps {
	selectedLog: LogEntry | null;
	onClose: () => void;
}

export function LogDetailsSheet({
	selectedLog,
	onClose,
}: LogDetailsSheetProps) {
	return (
		<Sheet open={!!selectedLog} onOpenChange={(open) => !open && onClose()}>
			<SheetContent className="sm:max-w-xl w-[90vw] overflow-y-auto">
				<SheetHeader className="mb-6">
					<SheetTitle>Log Details</SheetTitle>
					<SheetDescription className="font-mono text-xs truncate">
						ID: {selectedLog?.id}
					</SheetDescription>
				</SheetHeader>

				{selectedLog && (
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<h4 className="text-sm font-medium text-muted-foreground">
									Timestamp
								</h4>
								<p className="text-sm font-mono">
									{selectedLog.timestamp || "N/A"}
								</p>
							</div>
							<div className="space-y-1">
								<h4 className="text-sm font-medium text-muted-foreground">
									Level
								</h4>
								<div>
									<Badge
										variant={
											getLevelBadgeColor(selectedLog.level) as
												| "default"
												| "secondary"
												| "destructive"
												| "outline"
										}
										className={getBadgeClassName(selectedLog.level)}
									>
										{selectedLog.level?.toUpperCase() || "UNKNOWN"}
									</Badge>
								</div>
							</div>
							<div className="space-y-1 col-span-2">
								<h4 className="text-sm font-medium text-muted-foreground">
									Source File
								</h4>
								<p className="text-sm">{selectedLog.sourceFile}</p>
							</div>
						</div>

						<Separator />

						<div className="space-y-2">
							<h4 className="text-sm font-medium text-muted-foreground">
								Message
							</h4>
							<div className="p-3 bg-muted rounded-md text-sm font-mono break-words whitespace-pre-wrap">
								{selectedLog.message}
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="text-sm font-medium text-muted-foreground">
								Raw JSON
							</h4>
							<div className="p-3 bg-zinc-950 text-zinc-50 rounded-md text-xs font-mono overflow-x-auto">
								<pre>{JSON.stringify(selectedLog.raw, null, 2)}</pre>
							</div>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
