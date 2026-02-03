"use client";

import { type ComponentType, forwardRef, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "../../navigation/Spinner";
import { Overlay, TooltipContent } from "../../overlays";
import { Button, type ButtonVariant } from "../Button/Button.js";

const COPY_TOOLTIP_DURATION_MS = 800;

export type InteractiveButtonProps = {
	children?: ReactNode;
	disabled?: boolean;
	icon?: ComponentType;
	inProgress?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
	className?: string;
	variant?: ButtonVariant;
	size?: "sm" | "lg";
	type?: "button" | "submit" | "reset";
	[key: string]: unknown;
};

export type CopyButtonProps = {
	value: string;
	copyIcon: ComponentType;
	copiedLabel: string;
	className?: string;
	variant?: ButtonVariant;
};

const ReflessInteractiveButton = (
	{ children, disabled, icon: Icon, inProgress, onClick, ...props }: InteractiveButtonProps,
	ref: React.Ref<HTMLButtonElement>,
) => {
	const [progress, setProgress] = useState(false);
	const mounted = useRef(true);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	const handleClick =
		typeof inProgress === "undefined" && onClick
			? async (e: React.MouseEvent<HTMLButtonElement>) => {
					setProgress(true);
					try {
						await onClick(e);
					} finally {
						if (mounted.current) {
							setProgress(false);
						}
					}
				}
			: onClick;
	const running = inProgress || progress;
	return (
		<Button {...props} disabled={disabled || running} onClick={handleClick} ref={ref}>
			{running ? (
				<Spinner animation="border" aria-hidden="true" as="span" className="me-2" role="status" size="sm" />
			) : null}
			{!running && Icon && <Icon />}
			{children}
		</Button>
	);
};

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(ReflessInteractiveButton);

export const CopyButton = ({
	value,
	copyIcon: CopyIcon,
	copiedLabel,
	className,
	variant = "outline-light",
}: CopyButtonProps) => {
	const [show, setShow] = useState(false);
	const [inProgress, setInProgress] = useState(false);
	const hideTooltip = useCallback(() => setShow(false), []);
	const target = useRef(null);

	useEffect(() => {
		if (show) {
			const timeout = setTimeout(hideTooltip, COPY_TOOLTIP_DURATION_MS);
			return () => clearTimeout(timeout);
		}
	}, [show, hideTooltip]);

	const copyValue = async () => {
		setInProgress(true);
		try {
			await navigator.clipboard.writeText(value);
			setShow(true);
		} finally {
			setInProgress(false);
		}
	};

	return (
		<>
			<InteractiveButton
				className={className}
				inProgress={inProgress}
				onClick={copyValue}
				ref={target}
				variant={variant}
			>
				<CopyIcon />
			</InteractiveButton>
			<Overlay target={target.current} show={show} placement="left">
				<TooltipContent placement="left">{copiedLabel}</TooltipContent>
			</Overlay>
		</>
	);
};
