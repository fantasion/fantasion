import type React from "react";

export type IconComponent = React.ComponentType;

export type LocalPhoto = Record<string, string>;

export type MediaObjectType = {
	id?: number | string;
	localPhoto?: LocalPhoto;
	[key: string]: unknown;
};

export type PreviewCommonProps = {
	localPhoto: LocalPhoto;
	size: string;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
};
