import clsx from "clsx";
import { type ElementType, forwardRef, type HTMLAttributes, type ReactNode } from "react";

// NOTE: Grid uses global CSS classes because of dynamic class name generation
// (e.g., fui-col-1 through fui-col-12, fui-col-sm-1 through fui-col-sm-12, etc.)
// These classes are generated via SCSS loops and must remain global.

// ============================================
// ROW
// ============================================

type RowAlign = "start" | "center" | "end" | "stretch" | "baseline";
type RowJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/** Render as different HTML element */
	as?: ElementType;
	/** Vertical alignment of columns */
	align?: RowAlign;
	/** Horizontal distribution of columns */
	justify?: RowJustify;
	/** Remove gutters between columns */
	noGutters?: boolean;
}

export const Row = forwardRef<HTMLDivElement, RowProps>(
	({ as: Component = "div", align, justify, noGutters, className, children, ...props }, ref) => (
		<Component
			ref={ref}
			className={clsx(
				"fui-row",
				align && `fui-row--align-${align}`,
				justify && `fui-row--justify-${justify}`,
				noGutters && "fui-row--no-gutters",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	),
);

Row.displayName = "Row";

// ============================================
// COL
// ============================================

type ColNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ColSizeSimple = ColNumber | "auto" | true;
type ColAlign = "start" | "center" | "end" | "stretch" | "baseline";

/** Column size can be a number, "auto", true, or an object with span and offset */
export type ColSize = ColSizeSimple | { span?: ColNumber | "auto"; offset?: number };

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	/** Default column size (number of columns out of 12, or 'auto') */
	span?: ColSizeSimple;
	/** Column size at xs breakpoint (same as span, react-bootstrap compatible) */
	xs?: ColSize;
	/** Column size at sm breakpoint */
	sm?: ColSize;
	/** Column size at md breakpoint */
	md?: ColSize;
	/** Column size at lg breakpoint */
	lg?: ColSize;
	/** Column size at xl breakpoint */
	xl?: ColSize;
	/** Column size at xxl breakpoint */
	xxl?: ColSize;
	/** Default offset */
	offset?: number;
	/** Offset at sm breakpoint */
	offsetSm?: number;
	/** Offset at md breakpoint */
	offsetMd?: number;
	/** Offset at lg breakpoint */
	offsetLg?: number;
	/** Offset at xl breakpoint */
	offsetXl?: number;
	/** Offset at xxl breakpoint */
	offsetXxl?: number;
	/** Self-alignment */
	align?: ColAlign;
}

export const Col = forwardRef<HTMLDivElement, ColProps>(
	(
		{
			span,
			xs,
			sm,
			md,
			lg,
			xl,
			xxl,
			offset,
			offsetSm,
			offsetMd,
			offsetLg,
			offsetXl,
			offsetXxl,
			align,
			className,
			children,
			...props
		},
		ref,
	) => {
		// Helper to extract span and offset from ColSize (can be number, "auto", true, or object)
		const parseColSize = (size: ColSize | undefined): { span?: ColSizeSimple; offset?: number } => {
			if (size === undefined) return {};
			if (typeof size === "object") return size;
			return { span: size };
		};

		const getSpanClass = (size: ColSizeSimple | undefined, prefix: string): string | null => {
			if (size === undefined) return null;
			if (size === true) return prefix;
			if (size === "auto") return `${prefix}--auto`;
			return `${prefix}-${size}`;
		};

		const getOffsetClass = (offsetVal: number | undefined, prefix: string): string | null => {
			if (offsetVal === undefined) return null;
			return `${prefix}--offset-${offsetVal}`;
		};

		// Parse responsive sizes
		const xsParsed = parseColSize(xs);
		const smParsed = parseColSize(sm);
		const mdParsed = parseColSize(md);
		const lgParsed = parseColSize(lg);
		const xlParsed = parseColSize(xl);
		const xxlParsed = parseColSize(xxl);

		// xs is the base size (same as span), use span if xs is not provided
		const baseSpan = xsParsed.span ?? span;

		const hasAnySize = baseSpan || smParsed.span || mdParsed.span || lgParsed.span || xlParsed.span || xxlParsed.span;

		return (
			<div
				ref={ref}
				className={clsx(
					// If no size props are provided, use the flex-grow column
					"fui-col",
					// Span classes
					getSpanClass(baseSpan, "fui-col"),
					getSpanClass(smParsed.span, "fui-col-sm"),
					getSpanClass(mdParsed.span, "fui-col-md"),
					getSpanClass(lgParsed.span, "fui-col-lg"),
					getSpanClass(xlParsed.span, "fui-col-xl"),
					getSpanClass(xxlParsed.span, "fui-col-xxl"),
					// Offset classes (from direct props or from parsed responsive objects)
					getOffsetClass(xsParsed.offset ?? offset, "fui-col"),
					getOffsetClass(smParsed.offset ?? offsetSm, "fui-col-sm"),
					getOffsetClass(mdParsed.offset ?? offsetMd, "fui-col-md"),
					getOffsetClass(lgParsed.offset ?? offsetLg, "fui-col-lg"),
					getOffsetClass(xlParsed.offset ?? offsetXl, "fui-col-xl"),
					getOffsetClass(xxlParsed.offset ?? offsetXxl, "fui-col-xxl"),
					// Alignment
					align && `fui-col--align-${align}`,
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Col.displayName = "Col";
