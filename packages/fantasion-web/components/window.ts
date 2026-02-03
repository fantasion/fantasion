"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

export const useOutsideClick = <T extends HTMLElement>(
	ref: RefObject<T | null>,
	onClick: (event: MouseEvent) => void,
): void => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target;
			if (ref.current && target instanceof Node && !ref.current.contains(target)) {
				onClick(event);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, onClick]);
};

export const useScroll = (): [number, number, boolean] => {
	const [scrollTop, setScrollTop] = useState(0);
	const [scrollTopMax, setScrollTopMax] = useState(0);
	const [scrolling, setScrolling] = useState(false);

	const readScrollTop = useCallback(() => {
		const docEl = globalThis.document?.documentElement;
		if (!docEl) {
			return 0;
		}
		return docEl.scrollTop || globalThis.document?.body?.scrollTop || 0;
	}, []);

	const readScrollTopMax = useCallback(() => {
		const docEl = globalThis.document?.documentElement;
		const body = globalThis.document?.body;
		if (!(docEl && body)) {
			return 0;
		}

		// Max scroll offset = full scroll height - viewport height
		const scrollHeight = Math.max(docEl.scrollHeight, body.scrollHeight);
		const clientHeight = docEl.clientHeight;
		return Math.max(scrollHeight - clientHeight, 0);
	}, []);

	const onScroll = useCallback(() => {
		const nextScrollTop = readScrollTop();
		setScrolling(nextScrollTop > scrollTop);
		setScrollTop(nextScrollTop);
	}, [scrollTop, readScrollTop]);

	const onResize = useCallback(() => {
		setScrollTopMax(readScrollTopMax());
		onScroll();
	}, [onScroll, readScrollTopMax]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
		};
	}, [onScroll, onResize]);

	useEffect(() => {
		setScrollTop(readScrollTop());
		setScrollTopMax(readScrollTopMax());
	}, [readScrollTop, readScrollTopMax]);

	return [scrollTop, scrollTopMax, scrolling];
};
