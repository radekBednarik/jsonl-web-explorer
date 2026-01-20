import { describe, expect, it } from "vitest";
import { parseJsonlFile } from "./log-parser";

describe("log-parser", () => {
	it("parses valid jsonl content correctly", async () => {
		const fileContent = `{"timestamp": "2024-01-20T10:00:00Z", "level": "INFO", "message": "Test log 1"}
{"timestamp": "2024-01-20T10:00:01Z", "level": "ERROR", "msg": "Test log 2"}`;

		const file = new File([fileContent], "test.jsonl", {
			type: "application/x-ndjson",
		});
		const entries = await parseJsonlFile(file);

		expect(entries).toHaveLength(2);
		expect(entries[0].level).toBe("INFO");
		expect(entries[0].message).toContain("Test log 1");
		expect(entries[1].level).toBe("ERROR");
		expect(entries[1].message).toContain("Test log 2");
	});

	it("handles mixed content gracefully", async () => {
		const fileContent = `{"level": "INFO", "msg": "Valid JSON"}
This is a raw text line
{"level": "WARN", "msg": "Another valid JSON"}`;

		const file = new File([fileContent], "mixed.jsonl", {
			type: "application/x-ndjson",
		});
		const entries = await parseJsonlFile(file);

		expect(entries).toHaveLength(3);
		expect(entries[0].level).toBe("INFO");
		expect(entries[1].level).toBe("error"); // Parser marks non-json as error/raw
		expect(entries[1].message).toBe("This is a raw text line");
		expect(entries[2].level).toBe("WARN");
	});
});
