import { Tooltip, type TooltipPlacement } from "@fantasion/ui";
import type { ReactNode } from "react";
import styles from "./tooltips.module.scss";

type TextTooltipProps = {
	children: ReactNode;
	tip?: ReactNode;
	placement?: TooltipPlacement | "auto" | "auto-start" | "auto-end";
};

export const TextTooltip = ({ children, placement = "top", tip }: TextTooltipProps) => {
	// Map auto placements to a default, since our Tooltip doesn't support auto
	const resolvedPlacement: TooltipPlacement =
		placement === "auto" || placement === "auto-start" || placement === "auto-end" ? "top" : placement;

	return tip ? (
		<Tooltip content={tip} placement={resolvedPlacement}>
			<span className={styles.tooltip}>{children}</span>
		</Tooltip>
	) : (
		children
	);
};
