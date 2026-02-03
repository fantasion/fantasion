import { useEffect, useState } from "react";

export const GALLERY_ROTATION_INTERVAL_MS = 6000;

export const useRotatingIndex = (items: unknown[], intervalMs: number): [number] => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (items.length === 0) return;
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % items.length);
		}, intervalMs);
		return () => clearInterval(interval);
	}, [items.length, intervalMs]);

	return [index];
};
