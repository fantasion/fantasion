import clsx from "clsx";
import {
	Children,
	createContext,
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import styles from "./Carousel.module.scss";

// ============================================
// CAROUSEL CONTEXT
// ============================================

interface CarouselContextValue {
	activeIndex: number;
	totalItems: number;
	onSelect: (index: number) => void;
	onPrev: () => void;
	onNext: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function _useCarouselContext() {
	return useContext(CarouselContext);
}

// ============================================
// CAROUSEL
// ============================================

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Controlled active index */
	activeIndex?: number;
	/** Default active index (uncontrolled) */
	defaultActiveIndex?: number;
	/** Callback when slide changes */
	onSelect?: (index: number) => void;
	/** Auto-play interval in ms (0 to disable) */
	interval?: number | null;
	/** Enable keyboard navigation */
	keyboard?: boolean;
	/** Pause on hover */
	pause?: "hover" | false;
	/** Enable touch swipe */
	touch?: boolean;
	/** Wrap around at ends */
	wrap?: boolean;
	/** Fade transition instead of slide */
	fade?: boolean;
	/** Show indicators */
	indicators?: boolean;
	/** Show controls */
	controls?: boolean;
	children: ReactNode;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
	(
		{
			activeIndex: controlledIndex,
			defaultActiveIndex = 0,
			onSelect,
			interval = 5000,
			keyboard = true,
			pause = "hover",
			touch = true,
			wrap = true,
			fade,
			indicators = true,
			controls = true,
			className,
			children,
			...props
		},
		ref,
	) => {
		const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
		const [isPaused, setIsPaused] = useState(false);

		const isControlled = controlledIndex !== undefined;
		const activeIndex = isControlled ? controlledIndex : internalIndex;

		const items = Children.toArray(children).filter(
			(child) =>
				typeof child === "object" &&
				"type" in child &&
				(child.type as { displayName?: string }).displayName === "CarouselItem",
		);
		const totalItems = items.length;

		const handleSelect = useCallback(
			(index: number) => {
				let newIndex = index;
				if (wrap) {
					if (index < 0) newIndex = totalItems - 1;
					else if (index >= totalItems) newIndex = 0;
				} else {
					if (index < 0) newIndex = 0;
					else if (index >= totalItems) newIndex = totalItems - 1;
				}

				if (isControlled) {
					onSelect?.(newIndex);
				} else {
					setInternalIndex(newIndex);
					onSelect?.(newIndex);
				}
			},
			[isControlled, onSelect, totalItems, wrap],
		);

		const handlePrev = useCallback(() => handleSelect(activeIndex - 1), [activeIndex, handleSelect]);
		const handleNext = useCallback(() => handleSelect(activeIndex + 1), [activeIndex, handleSelect]);

		// Auto-play
		useEffect(() => {
			if (!interval || isPaused) return;

			const timer = setInterval(() => {
				handleNext();
			}, interval);

			return () => clearInterval(timer);
		}, [interval, isPaused, handleNext]);

		// Keyboard navigation
		useEffect(() => {
			if (!keyboard) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "ArrowLeft") {
					handlePrev();
				} else if (e.key === "ArrowRight") {
					handleNext();
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [keyboard, handlePrev, handleNext]);

		const handleMouseEnter = () => {
			if (pause === "hover") setIsPaused(true);
		};

		const handleMouseLeave = () => {
			if (pause === "hover") setIsPaused(false);
		};

		return (
			<CarouselContext.Provider
				value={{
					activeIndex: activeIndex,
					totalItems: totalItems,
					onSelect: handleSelect,
					onPrev: handlePrev,
					onNext: handleNext,
				}}
			>
				<div
					ref={ref}
					className={clsx(styles.carousel, fade && styles.fade, className)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					{...props}
				>
					{indicators && (
						<div className={styles.indicators}>
							{items.map((_, index) => (
								<button
									key={index}
									type="button"
									className={clsx(styles.indicator, index === activeIndex && styles.indicatorActive)}
									onClick={() => handleSelect(index)}
									aria-current={index === activeIndex}
									aria-label={`Slide ${index + 1}`}
								/>
							))}
						</div>
					)}

					<div className={styles.inner}>
						{items.map((child, index) => (
							<div key={index} className={clsx(styles.item, index === activeIndex && styles.itemActive)}>
								{child}
							</div>
						))}
					</div>

					{controls && totalItems > 1 && (
						<>
							<button type="button" className={clsx(styles.control, styles.controlPrev)} onClick={handlePrev}>
								<span className={clsx(styles.controlIcon, styles.controlIconPrev)} aria-hidden="true" />
								<span className={styles.visuallyHidden}>Previous</span>
							</button>
							<button type="button" className={clsx(styles.control, styles.controlNext)} onClick={handleNext}>
								<span className={clsx(styles.controlIcon, styles.controlIconNext)} aria-hidden="true" />
								<span className={styles.visuallyHidden}>Next</span>
							</button>
						</>
					)}
				</div>
			</CarouselContext.Provider>
		);
	},
);

Carousel.displayName = "Carousel";

// ============================================
// CAROUSEL ITEM
// ============================================

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
	/** Interval for this specific item (overrides carousel interval) */
	interval?: number;
	children: ReactNode;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
	({ interval, className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.itemContent, className)} data-interval={interval} {...props}>
			{children}
		</div>
	),
);

CarouselItem.displayName = "CarouselItem";

// ============================================
// CAROUSEL CAPTION
// ============================================

export interface CarouselCaptionProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CarouselCaption = forwardRef<HTMLDivElement, CarouselCaptionProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.caption, className)} {...props}>
			{children}
		</div>
	),
);

CarouselCaption.displayName = "CarouselCaption";
