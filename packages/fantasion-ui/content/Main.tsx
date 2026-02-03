import type { ReactNode } from "react";

export type MainProps = {
	children?: ReactNode;
	className?: string;
	[key: string]: unknown;
};

export const Main = ({ children, ...props }: MainProps) => <main {...props}>{children}</main>;
