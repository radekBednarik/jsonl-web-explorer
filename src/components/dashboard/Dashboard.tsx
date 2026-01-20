import { useMemo, useState } from "react";
import {
	ResizableHandle,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	type FileMetadata,
	type LogEntry,
	parseJsonlFile,
} from "@/lib/log-parser";
import { DashboardHeader } from "./DashboardHeader";
import { FileSidebar } from "./FileSidebar";
import { LogDetailsSheet } from "./LogDetailsSheet";
import { LogTable } from "./LogTable";

export function Dashboard() {
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	// Filter logs based on search query
	const filteredLogs = useMemo(() => {
		if (!searchQuery) return logs;
		const lowerQuery = searchQuery.toLowerCase();
		return logs.filter(
			(log) =>
				log.message.toLowerCase().includes(lowerQuery) ||
				log.level?.toLowerCase().includes(lowerQuery) ||
				log.sourceFile.toLowerCase().includes(lowerQuery),
		);
	}, [logs, searchQuery]);

	const onDrop = async (acceptedFiles: File[]) => {
		for (const file of acceptedFiles) {
			// Check if file is already added to avoid duplicates
			if (files.some((f) => f.name === file.name && f.size === file.size)) {
				continue;
			}

			try {
				const newLogs = await parseJsonlFile(file);
				const newFileMeta: FileMetadata = {
					id: crypto.randomUUID(),
					name: file.name,
					size: file.size,
					entryCount: newLogs.length,
				};

				setFiles((prev) => [...prev, newFileMeta]);
				setLogs((prev) => [...prev, ...newLogs]);
			} catch (error) {
				console.error("Failed to parse file:", file.name, error);
			}
		}
	};

	const removeFile = (fileId: string) => {
		const fileToRemove = files.find((f) => f.id === fileId);
		if (!fileToRemove) return;

		setFiles((prev) => prev.filter((f) => f.id !== fileId));
		setLogs((prev) => prev.filter((l) => l.sourceFile !== fileToRemove.name));
	};

	const clearAll = () => {
		setFiles([]);
		setLogs([]);
		setSearchQuery("");
	};

	return (
		<div className="h-screen w-full bg-background flex flex-col overflow-hidden">
			<DashboardHeader
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onClearAll={clearAll}
				hasFiles={files.length > 0}
				isSidebarOpen={isSidebarOpen}
				onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
			/>

			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<FileSidebar
					files={files}
					isSidebarOpen={isSidebarOpen}
					onSidebarOpenChange={setIsSidebarOpen}
					onFilesDrop={onDrop}
					onFileRemove={removeFile}
				/>

				<ResizableHandle withHandle />

				<LogTable
					logs={logs}
					filteredLogs={filteredLogs}
					searchQuery={searchQuery}
					onLogSelect={setSelectedLog}
					hasFiles={files.length > 0}
				/>
			</ResizablePanelGroup>

			<LogDetailsSheet
				selectedLog={selectedLog}
				onClose={() => setSelectedLog(null)}
			/>
		</div>
	);
}
