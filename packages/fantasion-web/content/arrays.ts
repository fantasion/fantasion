"use client";

import { useEffect, useState } from "react";

function getRandomIndex<T>(items: T[]): number {
	return Math.floor(Math.random() * items.length);
}

function getRandomFilteredIndex<T>(items: T[], currentIndex: number): number | null {
	// Oh my glob. There has to be a better way to do this. But time is mana.
	const baseArray = Object.keys(items)
		.map((key) => Number.parseInt(key, 10))
		.filter((key) => key !== currentIndex);
	if (baseArray.length === 0) {
		return null;
	}
	return baseArray[getRandomIndex(baseArray)];
}

export function useRotatingIndex<T>(items: T[], ttl = 16_000) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const nextIndex = getRandomFilteredIndex(items, index);
			if (nextIndex !== null) {
				setIndex(nextIndex);
			}
		}, ttl);

		return () => {
			clearTimeout(timeout);
		};
	});

	return [index, setIndex];
}
