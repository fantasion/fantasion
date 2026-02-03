"use client";

import clsx from "clsx";
import { useState } from "react";
import { LightBox } from "./LightBox.js";
import { isValidMedia, MediaObject } from "./MediaObject.js";
import styles from "./media.module.scss";
import type { IconComponent, MediaObjectType } from "./types.js";

export type ThumbGalleryProps = {
	className?: string;
	media: MediaObjectType[];
	lightbox?: boolean;
	closeIcon?: IconComponent;
	prevIcon?: IconComponent;
	nextIcon?: IconComponent;
	closeLabel?: string;
	prevLabel?: string;
	nextLabel?: string;
};

export const ThumbGallery = ({
	className,
	media,
	lightbox = true,
	closeIcon,
	prevIcon,
	nextIcon,
	closeLabel,
	prevLabel,
	nextLabel,
}: ThumbGalleryProps) => {
	const [showDetail, setShowDetail] = useState(false);
	const [detail, setDetail] = useState<MediaObjectType | null>(null);
	const createLightboxOpen = (mediaObject: MediaObjectType) => () => {
		setDetail(mediaObject);
		setShowDetail(true);
	};
	const currentIndex = detail ? media.indexOf(detail) : -1;
	const nextObj = currentIndex >= 0 ? media[currentIndex + 1] : undefined;
	const prevObj = currentIndex >= 0 ? media[currentIndex - 1] : undefined;
	const handleClose = () => setShowDetail(false);
	const handleNext = nextObj ? () => setDetail(nextObj) : null;
	const handlePrev = prevObj ? () => setDetail(prevObj) : null;
	return (
		<>
			{lightbox && closeIcon && prevIcon && nextIcon && (
				<LightBox
					mediaObject={detail}
					onClose={handleClose}
					onNext={handleNext}
					onPrev={handlePrev}
					show={showDetail}
					closeIcon={closeIcon}
					prevIcon={prevIcon}
					nextIcon={nextIcon}
					closeLabel={closeLabel}
					prevLabel={prevLabel}
					nextLabel={nextLabel}
				/>
			)}
			<div className={clsx(styles.thumbGallery, className)}>
				{media.filter(isValidMedia).map((mediaObject: MediaObjectType, index: number) => (
					<MediaObject
						className={styles.thumb}
						key={mediaObject.id ?? index}
						mediaObject={mediaObject}
						size="galleryDecoration"
						onDetail={createLightboxOpen(mediaObject)}
					/>
				))}
			</div>
		</>
	);
};
