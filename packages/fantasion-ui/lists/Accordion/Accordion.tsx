import clsx from "clsx";
import {
	type ButtonHTMLAttributes,
	createContext,
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useContext,
} from "react";
import styles from "./Accordion.module.scss";

interface AccordionContextValue {
	activeKey: string | string[] | null;
	onToggle: (key: string) => void;
	alwaysOpen: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
function useAccordionContext() {
	return useContext(AccordionContext);
}

interface AccordionItemContextValue {
	eventKey: string;
}
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);
function useAccordionItemContext() {
	return useContext(AccordionItemContext);
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
	activeKey?: string | string[] | null;
	onToggle?: (key: string) => void;
	alwaysOpen?: boolean;
	flush?: boolean;
	children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
	({ activeKey = null, onToggle = () => {}, alwaysOpen = false, flush, className, children, ...props }, ref) => (
		<AccordionContext.Provider value={{ activeKey, onToggle, alwaysOpen }}>
			<div ref={ref} className={clsx(styles.accordion, flush && styles.flush, className)} {...props}>
				{children}
			</div>
		</AccordionContext.Provider>
	),
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	eventKey: string;
	children: ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
	({ eventKey, className, children, ...props }, ref) => (
		<AccordionItemContext.Provider value={{ eventKey }}>
			<div ref={ref} className={clsx(styles.item, className)} {...props}>
				{children}
			</div>
		</AccordionItemContext.Provider>
	),
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: ReactNode;
}

export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
	({ as: Component = "h2", className, children, ...props }, ref) => (
		<Component ref={ref} className={clsx(styles.header, className)} {...props}>
			{children}
		</Component>
	),
);
AccordionHeader.displayName = "AccordionHeader";

export interface AccordionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>(
	({ className, children, ...props }, ref) => {
		const accordionContext = useAccordionContext();
		const itemContext = useAccordionItemContext();

		if (!(accordionContext && itemContext)) {
			throw new Error("AccordionButton must be used within Accordion and AccordionItem");
		}

		const { activeKey, onToggle, alwaysOpen } = accordionContext;
		const { eventKey } = itemContext;

		const isExpanded = alwaysOpen
			? Array.isArray(activeKey)
				? activeKey.includes(eventKey)
				: activeKey === eventKey
			: activeKey === eventKey;

		return (
			<button
				ref={ref}
				type="button"
				className={clsx(styles.button, isExpanded && styles.buttonExpanded, className)}
				onClick={() => onToggle(eventKey)}
				aria-expanded={isExpanded}
				{...props}
			>
				{children}
			</button>
		);
	},
);
AccordionButton.displayName = "AccordionButton";

export interface AccordionCollapseProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const AccordionCollapse = forwardRef<HTMLDivElement, AccordionCollapseProps>(
	({ className, children, ...props }, ref) => {
		const accordionContext = useAccordionContext();
		const itemContext = useAccordionItemContext();

		if (!(accordionContext && itemContext)) {
			throw new Error("AccordionCollapse must be used within Accordion and AccordionItem");
		}

		const { activeKey, alwaysOpen } = accordionContext;
		const { eventKey } = itemContext;

		const isExpanded = alwaysOpen
			? Array.isArray(activeKey)
				? activeKey.includes(eventKey)
				: activeKey === eventKey
			: activeKey === eventKey;

		return (
			<div ref={ref} className={clsx(styles.collapse, isExpanded && styles.collapseShow, className)} {...props}>
				{/* Inner wrapper needed for CSS grid height animation */}
				<div>{children}</div>
			</div>
		);
	},
);
AccordionCollapse.displayName = "AccordionCollapse";

export interface AccordionBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const AccordionBody = forwardRef<HTMLDivElement, AccordionBodyProps>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={clsx(styles.body, className)} {...props}>
			{children}
		</div>
	),
);
AccordionBody.displayName = "AccordionBody";
