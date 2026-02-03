import clsx from "clsx";
import type { ReactNode } from "react";
import { Container } from "../../grid/index.js";
import styles from "./FeatureSection.module.scss";

export type FeatureSectionProps = {
	/** Section title */
	title?: ReactNode;
	/** Section content */
	children: ReactNode;
	/** Background element (shapes, gradients, etc.) */
	background?: ReactNode;
	/** Container fluid breakpoint */
	fluid?: boolean | "sm" | "md" | "lg" | "xl" | "xxl";
	/** Additional class name for the section */
	className?: string;
	/** Additional class name for the container */
	containerClassName?: string;
	/** Additional class name for the title */
	titleClassName?: string;
	/** HTML element for the section */
	as?: "section" | "div" | "article";
	/** Heading level for the title (2-6) */
	headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/**
 * FeatureSection - A highlighted section with title and content.
 *
 * @example
 * ```tsx
 * <FeatureSection
 *   title="Our Features"
 *   background={<div className="gradient-bg" />}
 * >
 *   <FeatureGrid>
 *     <FeatureCard title="Fast" icon={<FastIcon />} />
 *     <FeatureCard title="Secure" icon={<SecureIcon />} />
 *   </FeatureGrid>
 * </FeatureSection>
 * ```
 */
export const FeatureSection = ({
	title,
	children,
	background,
	fluid = "xl",
	className,
	containerClassName,
	titleClassName,
	as: Component = "section",
	headingLevel = 2,
}: FeatureSectionProps) => {
	const HeadingTag = `h${headingLevel}` as const;

	return (
		<Component className={clsx(styles.section, className)}>
			{background && <div className={styles.background}>{background}</div>}
			<div className={styles.content}>
				<Container className={containerClassName} fluid={fluid}>
					{title && <HeadingTag className={clsx(styles.title, titleClassName)}>{title}</HeadingTag>}
					{children}
				</Container>
			</div>
		</Component>
	);
};

FeatureSection.displayName = "FeatureSection";
