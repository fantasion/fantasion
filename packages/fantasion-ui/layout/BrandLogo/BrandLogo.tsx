import clsx from "clsx";
import type { ImgHTMLAttributes } from "react";
import styles from "./BrandLogo.module.scss";

export type BrandLogoProps = {
	/** URL to the SVG logo file */
	logoSrc: string;
	/** Width of the logo */
	width?: number | string;
	/** Height of the logo */
	height?: number | string;
	/** ViewBox for the SVG (e.g., "0 0 100 100") */
	viewBox?: string;
	/** ID of the symbol in the SVG to reference (for sprite sheets) */
	symbolId?: string;
	/** Alt text / aria-label for the logo */
	alt?: string;
	/** Additional class name */
	className?: string;
} & Omit<ImgHTMLAttributes<SVGElement>, "src" | "alt">;

/**
 * BrandLogo - Renders a brand logo as an SVG.
 *
 * Supports two modes:
 * 1. Direct SVG reference via `logoSrc`
 * 2. SVG sprite sheet with `logoSrc` and `symbolId`
 *
 * @example
 * ```tsx
 * // Direct SVG
 * <BrandLogo logoSrc="/logo.svg" width={32} height={32} alt="My Brand" />
 *
 * // SVG sprite sheet
 * <BrandLogo
 *   logoSrc="/sprites.svg"
 *   symbolId="logo"
 *   viewBox="0 0 100 100"
 *   width={32}
 *   height={32}
 *   alt="My Brand"
 * />
 * ```
 */
export const BrandLogo = ({
	logoSrc,
	width = 32,
	height = 32,
	viewBox,
	symbolId,
	alt = "Logo",
	className,
	...props
}: BrandLogoProps) => {
	// If symbolId is provided, use <use> element for sprite sheets
	if (symbolId) {
		return (
			<svg
				width={width}
				height={height}
				viewBox={viewBox}
				xmlns="http://www.w3.org/2000/svg"
				role="img"
				aria-label={alt}
				className={clsx(styles.logo, className)}
				{...props}
			>
				<use href={`${logoSrc}#${symbolId}`} />
			</svg>
		);
	}

	// Otherwise render as an img tag for direct SVG files
	return <img src={logoSrc} width={width} height={height} alt={alt} className={clsx(styles.logo, className)} />;
};

BrandLogo.displayName = "BrandLogo";
