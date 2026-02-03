import clsx from "clsx";
import Markdown from "react-markdown";
import rehypeShiftHeading from "rehype-shift-heading";
import styles from "./MarkdownContent.module.scss";

export interface MarkdownContentProps extends Omit<React.ComponentProps<typeof Markdown>, "rehypePlugins"> {
	/** Markdown content to render */
	children?: string | null | undefined;
	/** Shift heading levels (e.g., 2 means h1 becomes h3) */
	headingOffset?: number;
	/** Additional class name */
	className?: string;
}

/**
 * MarkdownContent - Renders markdown content with optional heading level adjustment.
 *
 * @example
 * ```tsx
 * <MarkdownContent headingOffset={2}>
 *   # This becomes h3
 *   Some **bold** text
 * </MarkdownContent>
 * ```
 */
export const MarkdownContent = ({ children, headingOffset = 0, className, ...props }: MarkdownContentProps) => (
	<Markdown
		{...props}
		rehypePlugins={headingOffset ? [[rehypeShiftHeading, { shift: headingOffset }]] : []}
		className={clsx(styles.markdown, className)}
	>
		{children}
	</Markdown>
);

MarkdownContent.displayName = "MarkdownContent";
