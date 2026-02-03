import clsx from "clsx";
import type { ReactNode } from "react";
import { Col, Container, Row } from "../../grid/index.js";
import styles from "./HeroSection.module.scss";

export type HeroSectionProps = {
	/** Main content (text, buttons, etc.) */
	children: ReactNode;
	/** Visual content (image, illustration, etc.) - displayed on the right on larger screens */
	visual?: ReactNode;
	/** Visually hidden title for accessibility (rendered as h1) */
	hiddenTitle?: string;
	/** Background element (shapes, gradients, etc.) */
	background?: ReactNode;
	/** Container fluid breakpoint */
	fluid?: boolean | "sm" | "md" | "lg" | "xl" | "xxl";
	/** Additional class name for the outer wrapper */
	className?: string;
	/** Additional class name for the container */
	containerClassName?: string;
	/** Reverse the column order (visual on left, content on right) */
	reversed?: boolean;
};

/**
 * HeroSection - A hero layout with content and visual columns.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   hiddenTitle="Welcome to Our Site"
 *   visual={<img src="/hero-image.jpg" alt="Hero" />}
 *   background={<div className="gradient-bg" />}
 * >
 *   <h2>Make Something Amazing</h2>
 *   <p>Start your journey today.</p>
 *   <Button>Get Started</Button>
 * </HeroSection>
 * ```
 */
export const HeroSection = ({
	children,
	visual,
	hiddenTitle,
	background,
	fluid = "xl",
	className,
	containerClassName,
	reversed = false,
}: HeroSectionProps) => {
	const contentCol = (
		<Col xs={12} md={6} className={clsx("d-flex justify-content-center", styles.contentCol)}>
			{hiddenTitle && <h1 className="visually-hidden">{hiddenTitle}</h1>}
			<div className={styles.content}>{children}</div>
		</Col>
	);

	const visualCol = visual ? (
		<Col xs={12} md={6} className={styles.visualCol}>
			{visual}
		</Col>
	) : null;

	return (
		<div className={clsx(styles.hero, className)}>
			{background && <div className={styles.background}>{background}</div>}
			<Container className={clsx(styles.container, containerClassName)} fluid={fluid}>
				<Row className="align-items-center">
					{reversed ? (
						<>
							{visualCol}
							{contentCol}
						</>
					) : (
						<>
							{contentCol}
							{visualCol}
						</>
					)}
				</Row>
			</Container>
		</div>
	);
};

HeroSection.displayName = "HeroSection";
