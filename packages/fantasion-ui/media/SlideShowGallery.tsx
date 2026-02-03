"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GALLERY_ROTATION_INTERVAL_MS, useRotatingIndex } from "./hooks.js";
import { isValidMedia, MediaObject } from "./MediaObject.js";
import styles from "./media.module.scss";
import type { MediaObjectType, PreviewCommonProps } from "./types.js";

export type SlideShowGalleryProps = {
	as?: React.ElementType;
	className?: string;
	media?: MediaObjectType[];
	previewComponent?: React.ComponentType<PreviewCommonProps>;
	size?: string;
	square?: boolean;
	onDetail?: (mediaObject: MediaObjectType, e: React.MouseEvent<HTMLElement>) => void;
} & Record<string, unknown>;

const ReflessSlideShowGallery = (
	{
		as: Component = "div",
		className,
		media,
		previewComponent,
		size = "galleryDecoration",
		square,
		onDetail,
		...rest
	}: SlideShowGalleryProps,
	ref: React.Ref<HTMLElement>,
) => {
	const validMedia = (media ?? []).filter(isValidMedia);
	const [activeIndex] = useRotatingIndex(validMedia, GALLERY_ROTATION_INTERVAL_MS);
	return (
		<Component
			{...rest}
			className={clsx(className, styles.slideShow, {
				[styles.squareLayout]: square,
			})}
			ref={ref}
		>
			{validMedia.map((mediaObject: MediaObjectType, index: number) => (
				<MediaObject
					className={clsx(styles.slideShowThumb, {
						[styles.slideShowCurrent]: activeIndex === index,
					})}
					key={mediaObject.id ?? index}
					mediaObject={mediaObject}
					onDetail={onDetail}
					previewComponent={previewComponent}
					size={size}
				/>
			))}
		</Component>
	);
};

export const SlideShowGallery = forwardRef<HTMLElement, SlideShowGalleryProps>(ReflessSlideShowGallery);
