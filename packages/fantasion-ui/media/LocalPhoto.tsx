"use client";

import clsx from "clsx";
import { useCallback } from "react";
import styles from "./media.module.scss";
import type { LocalPhoto as LocalPhotoType, PreviewCommonProps } from "./types.js";

const PreviewImage = ({ localPhoto, size, className, onClick }: PreviewCommonProps) => {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (onClick && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		},
		[onClick],
	);

	const isInteractive = Boolean(onClick);
	return (
		<div
			className={className}
			onClick={onClick}
			role={isInteractive ? "button" : undefined}
			tabIndex={isInteractive ? 0 : undefined}
			onKeyDown={isInteractive ? handleKeyDown : undefined}
		>
			<img className={styles.galleryImage} alt="" src={localPhoto[size]} width={200} height={200} />
		</div>
	);
};

const PreviewDiv = ({ className, localPhoto, size, onClick }: PreviewCommonProps) => {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (onClick && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		},
		[onClick],
	);

	const isInteractive = Boolean(onClick);
	return (
		<div
			className={clsx(className, styles.previewDiv)}
			style={{ backgroundImage: `url(${localPhoto[size]})` }}
			onClick={onClick}
			role={isInteractive ? "button" : undefined}
			tabIndex={isInteractive ? 0 : undefined}
			onKeyDown={isInteractive ? handleKeyDown : undefined}
		/>
	);
};

export { PreviewDiv };

type LocalPhotoProps = {
	previewComponent?: React.ComponentType<
		PreviewCommonProps & { className?: string; onClick?: React.MouseEventHandler<HTMLElement> }
	>;
	localPhoto: LocalPhotoType;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
	size?: string;
};

export const LocalPhoto = ({
	previewComponent: PreviewComponent = PreviewImage,
	localPhoto,
	className,
	onClick,
	size = "galleryDecoration",
}: LocalPhotoProps) => <PreviewComponent localPhoto={localPhoto} className={className} onClick={onClick} size={size} />;
