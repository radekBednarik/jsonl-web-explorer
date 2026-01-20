import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type LogEntry = {
	id: string;
	timestamp: string | null;
	level: string | null;
	message: string;
	raw: Record<string, unknown>;
	originalLine: string;
	sourceFile: string;
};

export type FileMetadata = {
	id: string;
	name: string;
	size: number;
	entryCount: number;
};

// Helper to guess standard log fields
function normalizeLogEntry(
	data: Record<string, unknown>,
	line: string,
	fileName: string,
): LogEntry {
	const keys = Object.keys(data);
	const lowerKeys = keys.map((k) => k.toLowerCase());

	// Attempt to find timestamp
	let timestamp = null;
	const timeKeyIndex = lowerKeys.findIndex(
		(k) => k.includes("time") || k.includes("date") || k === "ts",
	);
	if (timeKeyIndex !== -1) {
		timestamp = String(data[keys[timeKeyIndex]]);
	}

	// Attempt to find level
	let level = null;
	const levelKeyIndex = lowerKeys.findIndex(
		(k) => k === "level" || k === "severity" || k === "type" || k === "lvl",
	);
	if (levelKeyIndex !== -1) {
		level = String(data[keys[levelKeyIndex]]);
	}

	// Attempt to find message
	let message = JSON.stringify(data);
	const msgKeyIndex = lowerKeys.findIndex(
		(k) => k === "message" || k === "msg" || k === "text" || k === "content",
	);
	if (msgKeyIndex !== -1) {
		const val = data[keys[msgKeyIndex]];
		message = typeof val === "string" ? val : JSON.stringify(val);
	}

	return {
		id: crypto.randomUUID(),
		timestamp,
		level,
		message,
		raw: data,
		originalLine: line,
		sourceFile: fileName,
	};
}

export async function parseJsonlFile(file: File): Promise<LogEntry[]> {
	const text = await file.text();
	const lines = text.split("\n");
	const entries: LogEntry[] = [];

	for (const line of lines) {
		if (!line.trim()) continue;
		try {
			const data = JSON.parse(line);
			if (typeof data === "object" && data !== null) {
				entries.push(normalizeLogEntry(data, line, file.name));
			} else {
				// Handle valid JSON that isn't an object (e.g. number or string)
				entries.push({
					id: crypto.randomUUID(),
					timestamp: null,
					level: "raw",
					message: String(data),
					raw: { value: data },
					originalLine: line,
					sourceFile: file.name,
				});
			}
		} catch (_e) {
			// Handle non-JSON lines
			entries.push({
				id: crypto.randomUUID(),
				timestamp: null,
				level: "error",
				message: line, // Treat the whole line as the message
				raw: { error: "Invalid JSON", content: line },
				originalLine: line,
				sourceFile: file.name,
			});
		}
	}
	return entries;
}
