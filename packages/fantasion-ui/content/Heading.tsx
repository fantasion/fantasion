import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
	level: number;
	children: React.ReactNode;
};

const minLevel = 1;
const maxLevel = 6;

export const Heading = ({ level, children, ...props }: HeadingProps) => {
	const clamped = Math.min(maxLevel, Math.max(minLevel, level));
	const tag = `h${clamped}` as HeadingTag;
	return React.createElement(tag, props, children);
};
