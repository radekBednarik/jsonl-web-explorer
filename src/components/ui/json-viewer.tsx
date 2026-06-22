import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
	data: unknown;
	defaultDepth?: number;
	className?: string;
}

interface JsonNodeProps {
	value: unknown;
	depth: number;
	defaultDepth: number;
	isLast: boolean;
}

const JsonNode = React.memo(function JsonNode({
	value,
	depth,
	defaultDepth,
	isLast,
}: JsonNodeProps) {
	const [isExpanded, setIsExpanded] = React.useState(depth < defaultDepth);

	const comma = !isLast ? (
		<span className="text-zinc-400">,</span>
	) : null;

	if (value === null) {
		return (
			<>
				<span className="text-zinc-500">null</span>
				{comma}
			</>
		);
	}

	if (typeof value === "boolean") {
		return (
			<>
				<span className="text-violet-400">{String(value)}</span>
				{comma}
			</>
		);
	}

	if (typeof value === "number") {
		return (
			<>
				<span className="text-amber-400">{value}</span>
				{comma}
			</>
		);
	}

	if (typeof value === "string") {
		if (value.length > 200) {
			return (
				<>
					<span className="text-emerald-400">"{value.slice(0, 200)}"</span>
					<span className="text-zinc-500"> … ({value.length} chars total)</span>
					{comma}
				</>
			);
		}
		return (
			<>
				<span className="text-emerald-400">"{value}"</span>
				{comma}
			</>
		);
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return (
				<>
					<span className="text-zinc-400">[]</span>
					{comma}
				</>
			);
		}

		if (!isExpanded) {
			return (
				<>
					<button
						type="button"
						className="inline-flex items-center gap-0.5 cursor-pointer select-none text-zinc-400 hover:text-zinc-100 transition-colors"
						onClick={() => setIsExpanded(true)}
					>
						<ChevronRight size={10} />
						<span className="text-zinc-500 italic">[{value.length} items]</span>
					</button>
					{comma}
				</>
			);
		}

		return (
			<>
				<button
					type="button"
					className="inline-flex items-center gap-0.5 cursor-pointer select-none text-zinc-400 hover:text-zinc-100 transition-colors"
					onClick={() => setIsExpanded(false)}
				>
					<ChevronDown size={10} />
					<span className="text-zinc-400">[</span>
				</button>
				<div className="pl-4">
					{value.map((item, i) => (
						<div key={i}>
							<JsonNode
								value={item}
								depth={depth + 1}
								defaultDepth={defaultDepth}
								isLast={i === value.length - 1}
							/>
						</div>
					))}
				</div>
				<div>
					<span className="text-zinc-400">]</span>
					{comma}
				</div>
			</>
		);
	}

	if (typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>);

		if (entries.length === 0) {
			return (
				<>
					<span className="text-zinc-400">{"{}"}</span>
					{comma}
				</>
			);
		}

		if (!isExpanded) {
			return (
				<>
					<button
						type="button"
						className="inline-flex items-center gap-0.5 cursor-pointer select-none text-zinc-400 hover:text-zinc-100 transition-colors"
						onClick={() => setIsExpanded(true)}
					>
						<ChevronRight size={10} />
						<span className="text-zinc-500 italic">
							{"{"}
							{entries.length} keys{"}"}
						</span>
					</button>
					{comma}
				</>
			);
		}

		return (
			<>
				<button
					type="button"
					className="inline-flex items-center gap-0.5 cursor-pointer select-none text-zinc-400 hover:text-zinc-100 transition-colors"
					onClick={() => setIsExpanded(false)}
				>
					<ChevronDown size={10} />
					<span className="text-zinc-400">{"{"}</span>
				</button>
				<div className="pl-4">
					{entries.map(([key, val], i) => (
						<div key={key}>
							<span className="text-sky-300">"{key}"</span>
							<span className="text-zinc-400">: </span>
							<JsonNode
								value={val}
								depth={depth + 1}
								defaultDepth={defaultDepth}
								isLast={i === entries.length - 1}
							/>
						</div>
					))}
				</div>
				<div>
					<span className="text-zinc-400">{"}"}</span>
					{comma}
				</div>
			</>
		);
	}

	return (
		<>
			<span className="text-zinc-500">{String(value)}</span>
			{comma}
		</>
	);
});

export function JsonViewer({ data, defaultDepth = 1, className }: JsonViewerProps) {
	const [expandKey, setExpandKey] = React.useState(0);
	const [activeDefaultDepth, setActiveDefaultDepth] = React.useState(defaultDepth);

	React.useEffect(() => {
		setActiveDefaultDepth(defaultDepth);
		setExpandKey((k) => k + 1);
	}, [data, defaultDepth]);

	const handleExpandAll = () => {
		setActiveDefaultDepth(Infinity);
		setExpandKey((k) => k + 1);
	};

	const handleCollapseAll = () => {
		setActiveDefaultDepth(0);
		setExpandKey((k) => k + 1);
	};

	return (
		<div
			className={cn(
				"bg-zinc-950 text-zinc-50 rounded-md text-xs font-mono overflow-x-auto",
				className,
			)}
		>
			<div className="flex justify-end gap-1 px-3 pt-2 pb-1 border-b border-zinc-800">
				<button
					type="button"
					onClick={handleExpandAll}
					className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
				>
					<ChevronsUpDown size={11} />
					<span>Expand All</span>
				</button>
				<button
					type="button"
					onClick={handleCollapseAll}
					className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
				>
					<ChevronsDownUp size={11} />
					<span>Collapse All</span>
				</button>
			</div>
			<div key={expandKey} className="p-3">
				<JsonNode value={data} depth={0} defaultDepth={activeDefaultDepth} isLast={true} />
			</div>
		</div>
	);
}
