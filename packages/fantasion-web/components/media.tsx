"use client";

import { type IconComponent, type MediaObjectType, ThumbGallery as UIThumbGallery } from "@fantasion/ui";
import { CloseIcon, NextIcon, PrevIcon } from "../content/icons";
import { useTranslation } from "../lib/i18n-context";

// Wrapper for ThumbGallery with i18n
export const ThumbGallery = ({
	className,
	media,
	lightbox = true,
}: {
	className?: string;
	media: MediaObjectType[];
	lightbox?: boolean;
}) => {
	const { t } = useTranslation();
	return (
		<UIThumbGallery
			className={className}
			media={media}
			lightbox={lightbox}
			closeIcon={CloseIcon as IconComponent}
			prevIcon={PrevIcon as IconComponent}
			nextIcon={NextIcon as IconComponent}
			closeLabel={t("close")}
			prevLabel={t("prev")}
			nextLabel={t("next")}
		/>
	);
};

// Re-export other components and types from @fantasion/ui
export { type MediaObjectType, PageTopGallery, SlideShowGallery } from "@fantasion/ui";
