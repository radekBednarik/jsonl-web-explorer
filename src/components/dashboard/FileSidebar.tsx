import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FileMetadata } from "@/lib/log-parser";
import { cn } from "@/lib/utils";

interface FileSidebarProps {
	files: FileMetadata[];
	isSidebarOpen: boolean;
	onSidebarOpenChange: (isOpen: boolean) => void;
	onFilesDrop: (files: File[]) => void;
	onFileRemove: (fileId: string) => void;
}

export function FileSidebar({
	files,
	isSidebarOpen,
	onSidebarOpenChange,
	onFilesDrop,
	onFileRemove,
}: FileSidebarProps) {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: onFilesDrop,
		accept: {
			"application/x-ndjson": [".jsonl", ".ndjson"],
			"application/json": [".json"],
			"text/plain": [".txt", ".log"],
		},
	});

	return (
		<ResizablePanel
			defaultSize={20}
			minSize={15}
			maxSize={30}
			collapsible={true}
			collapsedSize={0}
			onCollapse={() => onSidebarOpenChange(false)}
			onExpand={() => onSidebarOpenChange(true)}
			className={cn(
				"bg-muted/30 flex flex-col transition-all duration-300 ease-in-out",
				!isSidebarOpen && "hidden",
			)}
		>
			<div className="p-4 flex flex-col h-full gap-4">
				<div
					{...getRootProps()}
					className={cn(
						"border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-muted/50 hover:border-primary/50",
						isDragActive
							? "border-primary bg-primary/10"
							: "border-muted-foreground/25",
					)}
				>
					<input {...getInputProps()} />
					<Upload className="h-8 w-8 mb-2 text-muted-foreground" />
					<p className="text-sm text-muted-foreground font-medium">
						{isDragActive ? "Drop files here" : "Drag & drop .jsonl files"}
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						or click to browse
					</p>
				</div>

				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-sm text-muted-foreground">
						Active Files ({files.length})
					</h3>
				</div>

				<ScrollArea className="flex-1 -mr-3 pr-3">
					<div className="flex flex-col gap-2">
						{files.length === 0 && (
							<div className="text-sm text-muted-foreground text-center py-8 italic">
								No files loaded
							</div>
						)}
						{files.map((file) => (
							<Card
								key={file.id}
								className="relative group overflow-hidden border-muted"
							>
								<CardContent className="p-3">
									<div className="flex items-start justify-between gap-2">
										<div className="grid gap-1">
											<div
												className="font-medium text-sm truncate max-w-[180px]"
												title={file.name}
											>
												{file.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{(file.size / 1024).toFixed(1)} KB • {file.entryCount}{" "}
												lines
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
											onClick={(e) => {
												e.stopPropagation();
												onFileRemove(file.id);
											}}
										>
											<X className="h-3 w-3" />
											<span className="sr-only">Remove file</span>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</ScrollArea>
			</div>
		</ResizablePanel>
	);
}
