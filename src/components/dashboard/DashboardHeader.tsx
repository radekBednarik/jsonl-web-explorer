import { FileJson, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onClearAll: () => void;
	hasFiles: boolean;
	isSidebarOpen: boolean;
	onSidebarToggle: () => void;
}

export function DashboardHeader({
	searchQuery,
	onSearchChange,
	onClearAll,
	hasFiles,
	isSidebarOpen,
	onSidebarToggle,
}: DashboardHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b px-6 py-3 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center gap-2 font-semibold text-lg">
				<FileJson className="h-6 w-6 text-primary" />
				<span>JSONL Explorer</span>
			</div>
			<div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
				<div className="relative w-full">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search logs..."
						className="w-full pl-9 bg-background"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onClearAll}
					disabled={!hasFiles}
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Clear All
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="lg:hidden"
					onClick={onSidebarToggle}
				>
					{isSidebarOpen ? "Hide Files" : "Show Files"}
				</Button>
			</div>
		</header>
	);
}
