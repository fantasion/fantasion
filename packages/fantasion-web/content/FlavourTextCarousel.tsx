import { QuoteCarousel, type QuoteItem } from "@fantasion/ui";

// Re-export Quote for direct use
export { Quote, type QuoteProps } from "@fantasion/ui";

// Fantasion uses different naming for flavour texts
export type Flavour = {
	text: string;
	quoteOwner: string;
};

export type FlavourTextCarouselProps = {
	flavourTexts: Flavour[];
	intervalMs?: number;
	className?: string;
};

/**
 * FlavourTextCarousel - A wrapper around QuoteCarousel that uses Fantasion's data format.
 * Maps `flavourTexts` (with `quoteOwner`) to `quotes` (with `author`).
 */
export const FlavourTextCarousel = ({ flavourTexts, intervalMs, className }: FlavourTextCarouselProps) => {
	const quotes: QuoteItem[] = flavourTexts.map((flavour) => ({
		text: flavour.text,
		author: flavour.quoteOwner,
	}));

	return <QuoteCarousel quotes={quotes} intervalMs={intervalMs} className={className} />;
};
