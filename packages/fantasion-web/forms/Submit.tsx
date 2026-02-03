"use client";

import type { PropsWithChildren } from "react";
import { InteractiveButton, type InteractiveButtonProps } from "../components/buttons";

type SubmitProps = PropsWithChildren<InteractiveButtonProps>;

export const Submit = ({ children, ...props }: SubmitProps) => (
	<InteractiveButton {...props} type="submit">
		{children}
	</InteractiveButton>
);
