import type { ElementType, ReactNode } from "react";

export type SectionProps = {
	as?: ElementType;
	component?: ElementType;
	className?: string;
	children?: ReactNode;
	[key: string]: unknown;
};

export const Section = ({ as, component, children, ...props }: SectionProps) => {
	const Component = as ?? component ?? "section";
	return <Component {...props}>{children}</Component>;
};
