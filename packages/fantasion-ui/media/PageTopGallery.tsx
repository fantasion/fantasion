"use client";

import { PreviewDiv } from "./LocalPhoto.js";
import styles from "./media.module.scss";
import { SlideShowGallery } from "./SlideShowGallery.js";
import type { MediaObjectType } from "./types.js";

type ColProps = {
	className?: string;
	xl?: number;
	children: React.ReactNode;
};

const Col = ({ className, children }: ColProps) => <div className={className}>{children}</div>;

export type PageTopGalleryProps = {
	media: MediaObjectType[];
	size?: string;
};

export const PageTopGallery = ({ media, size = "galleryDetail" }: PageTopGalleryProps) => {
	if (media.length === 0) {
		return null;
	}
	return (
		<Col className={styles.pageTopGalleryContainer} xl={5}>
			<SlideShowGallery className={styles.pageTopGallery} media={media} previewComponent={PreviewDiv} size={size} />
		</Col>
	);
};
