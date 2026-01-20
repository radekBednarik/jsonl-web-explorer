export const getLevelBadgeColor = (level: string | null) => {
	if (!level) return "secondary";
	const l = level.toLowerCase();
	if (l.includes("err") || l.includes("fail") || l.includes("crit"))
		return "destructive";
	if (l.includes("warn")) return "warning"; // Custom warning variant logic handling needed in component
	if (l.includes("info")) return "default";
	if (l.includes("debug")) return "secondary";
	return "outline";
};

export const getBadgeClassName = (level: string | null) => {
	const l = level?.toLowerCase() || "";
	if (l.includes("warn"))
		return "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent";
	return "";
};
