import type { ReactNode } from "react";
import styles from "./IconBubble.module.scss";

export type IconBubbleProps = {
	children?: ReactNode;
	className?: string;
	[key: string]: unknown;
};

export const IconBubble = ({ children, className, ...props }: IconBubbleProps) => (
	<div className={`${styles.bubble} ${className || ""}`} {...props}>
		{children}
	</div>
);
