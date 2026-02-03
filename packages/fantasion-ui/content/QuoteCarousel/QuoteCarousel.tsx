"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useRotatingIndex } from "../../media/hooks.js";
import { MarkdownContent } from "../MarkdownContent/index.js";
import styles from "./QuoteCarousel.module.scss";

const DEFAULT_INITIAL_HEIGHT_PX = 32;
const DEFAULT_ROTATION_INTERVAL_MS = 9000;

// ============================================
// QUOTE
// ============================================

export interface QuoteProps {
	/** Quote text (can include markdown) */
	text: string;
	/** Attribution/author name */
	author: string;
	/** Additional class name */
	className?: string;
}

/**
 * Quote - A single blockquote with author attribution.
 */
export const Quote = ({ text, author, className }: QuoteProps) => {
	const [height, setHeight] = useState(DEFAULT_INITIAL_HEIGHT_PX);
	const contentRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (contentRef.current) {
			setHeight(contentRef.current.clientHeight);
		}
	}, [text]);

	return (
		<blockquote className={clsx(styles.quote, className)} style={{ height }}>
			<span className={styles.content} ref={contentRef}>
				<div className={styles.text}>
					{'"'}
					<MarkdownContent>{text}</MarkdownContent>
					{'"'}
				</div>
				<span className={styles.author}>{`— ${author}`}</span>
			</span>
		</blockquote>
	);
};

Quote.displayName = "Quote";

// ============================================
// QUOTE CAROUSEL
// ============================================

export interface QuoteItem {
	/** Quote text (can include markdown) */
	text: string;
	/** Attribution/author name */
	author: string;
}

export interface QuoteCarouselProps {
	/** Array of quotes to rotate through */
	quotes: QuoteItem[];
	/** Rotation interval in milliseconds */
	intervalMs?: number;
	/** Additional class name */
	className?: string;
}

/**
 * QuoteCarousel - A rotating carousel of quotes/testimonials.
 *
 * @example
 * ```tsx
 * <QuoteCarousel
 *   quotes={[
 *     { text: "Great service!", author: "John Doe" },
 *     { text: "Amazing experience.", author: "Jane Smith" },
 *   ]}
 *   intervalMs={5000}
 * />
 * ```
 */
export const QuoteCarousel = ({ quotes, intervalMs = DEFAULT_ROTATION_INTERVAL_MS, className }: QuoteCarouselProps) => {
	const [currentIndex] = useRotatingIndex(quotes, intervalMs);
	const currentQuote = quotes[currentIndex];

	if (!currentQuote) {
		return null;
	}

	return <Quote text={currentQuote.text} author={currentQuote.author} className={className} />;
};

QuoteCarousel.displayName = "QuoteCarousel";
