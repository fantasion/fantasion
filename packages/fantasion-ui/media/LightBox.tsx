"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { MediaObject } from "./MediaObject.js";
import styles from "./media.module.scss";
import type { IconComponent, MediaObjectType } from "./types.js";

type ButtonProps = {
	className?: string;
	disabled?: boolean;
	onClick?: (() => void) | undefined;
	title?: string;
	children: React.ReactNode;
};

const Button = ({ className, disabled, onClick, title, children }: ButtonProps) => (
	<button className={className} disabled={disabled} onClick={onClick} title={title} type="button">
		{children}
	</button>
);

type ModalProps = {
	centered?: boolean;
	className?: string;
	fullscreen?: boolean;
	onClick?: React.MouseEventHandler<HTMLElement>;
	onEntered?: () => void;
	onHide: () => void;
	show: boolean;
	size?: string;
	children: React.ReactNode;
};

const Modal = ({ className, onClick, onEntered, onHide, show, children }: ModalProps) => {
	useEffect(() => {
		if (show && onEntered) {
			onEntered();
		}
	}, [show, onEntered]);

	if (!show) return null;

	return (
		<div className={clsx("modal", className)} onClick={onClick} style={{ display: "block" }}>
			<div className="modal-dialog modal-dialog-centered modal-fullscreen">
				<div className="modal-content" onClick={onClick}>
					{children}
				</div>
			</div>
		</div>
	);
};

type LightBoxButtonProps = {
	className?: string;
	icon: IconComponent;
	onClick?: (() => void) | null;
	title?: string;
};

const LightBoxButton = ({ className, icon: Icon, onClick, title }: LightBoxButtonProps) => (
	<Button
		className={clsx(styles.lightboxButton, className)}
		disabled={!onClick}
		onClick={onClick || undefined}
		title={title}
	>
		<Icon />
	</Button>
);

export type LightBoxProps = {
	mediaObject: MediaObjectType | null;
	onNext?: (() => void) | null;
	onPrev?: (() => void) | null;
	onClose: () => void;
	show: boolean;
	closeIcon: IconComponent;
	prevIcon: IconComponent;
	nextIcon: IconComponent;
	closeLabel?: string;
	prevLabel?: string;
	nextLabel?: string;
};

export const LightBox = ({
	mediaObject,
	onNext,
	onPrev,
	onClose,
	show,
	closeIcon,
	prevIcon,
	nextIcon,
	closeLabel = "Close",
	prevLabel = "Previous",
	nextLabel = "Next",
}: LightBoxProps) => {
	const container = useRef<HTMLDivElement | null>(null);
	const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains("modal-content")) {
			onClose();
		}
	};

	const handleOpenFocus = () => container.current?.focus();
	const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "ArrowLeft" && onPrev) {
			onPrev();
		}
		if (e.key === "ArrowRight" && onNext) {
			onNext();
		}
	};
	return (
		<Modal
			centered={true}
			className={styles.lightbox}
			fullscreen={true}
			onClick={handleBackdropClick}
			onEntered={handleOpenFocus}
			onHide={onClose}
			show={show}
			size="xl"
		>
			<div className={styles.lightboxContainer} onKeyUp={handleKeyUp} ref={container} tabIndex={-1}>
				<LightBoxButton className={styles.lightboxClose} icon={closeIcon} onClick={onClose} title={closeLabel} />
				<LightBoxButton className={styles.lightboxPrev} icon={prevIcon} onClick={onPrev} title={prevLabel} />
				<LightBoxButton className={styles.lightboxNext} icon={nextIcon} onClick={onNext} title={nextLabel} />
				{mediaObject ? <MediaObject mediaObject={mediaObject} size="galleryDetail" /> : null}
			</div>
		</Modal>
	);
};
