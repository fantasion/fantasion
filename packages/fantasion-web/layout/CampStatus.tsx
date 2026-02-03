"use client";

import type React from "react";
import styles from "./CampStatus.module.scss";

export type CampStatus = {
	className?: string;
	/** Footer-friendly height (number => px). Default: 220 */
	height?: number | string;
	/** Scales the illustration (keeps layout stable). Default: 0.6 */
	scale?: number;
	/** Optional: override CSS vars (colors) via style */
	style?: React.CSSProperties;
};

function cx(...parts: Array<string | undefined | false>) {
	return parts.filter(Boolean).join(" ");
}

export function CampStatus({ className, height = 220, scale = 1, style }: CampStatus) {
	const h = typeof height === "number" ? `${height}px` : height;

	return (
		<div
			className={cx(styles.container, className)}
			style={
				{
					...style,
					"--campfire-height": h,
					"--campfire-scale": String(scale),
				} as React.CSSProperties
			}
			aria-hidden="true"
		>
			<div className={styles["campfire-wrapper"]}>
				<div className={styles["tree-container-back"]}>
					<div className={styles["tree-8"]} />
					<div className={styles["tree-9"]} />
					<div className={styles["tree-10"]} />
				</div>

				<div className={styles["rock-container"]}>
					<div className={styles["rock-big"]} />
					<div className={styles["rock-small"]}>
						<div className={styles["rock-1"]} />
						<div className={styles["rock-2"]} />
						<div className={styles["rock-3"]} />
						<div className={styles["rock-4"]} />
					</div>
				</div>

				<div className={styles["smoke-container"]}>
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: SVG is purely decorative and hidden from accessibility */}
					<svg className={styles.smokeSvg} viewBox="0 0 200 600" preserveAspectRatio="none">
						<path d="M 150 0 Q 200 100 100 250 C 0 450 120 400 50 600" />
					</svg>

					<div className={styles["fire-container"]}>
						<div className={styles["flame-1"]} />
						<div className={styles["flame-2"]} />
						<div className={styles["flame-3"]} />
					</div>
				</div>

				<div className={styles["tree-container-front"]}>
					<div className={styles["tree-1"]} />
					<div className={styles["tree-2"]} />
					<div className={styles["tree-3"]} />
					<div className={styles["tree-4"]} />
					<div className={styles["tree-5"]} />
					<div className={styles["tree-6"]} />
					<div className={styles["tree-7"]} />
				</div>
			</div>
		</div>
	);
}
