import type { ComponentType, ReactNode } from "react";

type IconComponent = ComponentType<{ className?: string }>;

export type IconLabelProps = {
	icon: IconComponent;
	text: ReactNode;
	className?: string;
};

export const IconLabel = ({ icon: Icon, text, className }: IconLabelProps) => (
	<span className={className}>
		<Icon className="me-1" /> {text}
	</span>
);
