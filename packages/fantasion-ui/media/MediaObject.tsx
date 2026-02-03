"use client";

import clsx from "clsx";
import { LocalPhoto } from "./LocalPhoto.js";
import styles from "./media.module.scss";
import type { MediaObjectType, PreviewCommonProps } from "./types.js";

export type MediaObjectProps = {
	className?: string;
	mediaObject: MediaObjectType;
	onDetail?: (mediaObject: MediaObjectType, e: React.MouseEvent<HTMLElement>) => void;
	previewComponent?: React.ComponentType<PreviewCommonProps>;
	size?: string;
};

export const MediaObject = ({ className, mediaObject, onDetail, previewComponent, size }: MediaObjectProps) => {
	const onClick = onDetail ? (e: React.MouseEvent<HTMLElement>) => onDetail(mediaObject, e) : undefined;
	const composedClass = clsx({ [styles.interactiveThumb]: Boolean(onDetail) }, className);
	if (mediaObject.localPhoto) {
		return (
			<LocalPhoto
				previewComponent={previewComponent}
				className={composedClass}
				localPhoto={mediaObject.localPhoto}
				onClick={onClick}
				size={size}
			/>
		);
	}
	return null;
};

export const isValidMedia = (mediaObject: MediaObjectType) => Boolean(mediaObject.localPhoto);
