"use client";

import { FormControl, InputGroup, InputGroupText } from "@fantasion/ui";
import classnames from "classnames";
import type React from "react";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import PasswordStrengthBar from "react-password-strength-bar";
import { InsecureIcon, SecureIcon, SecurityWarningIcon } from "../content/icons";
import { useTranslation } from "../lib/i18n-context";
import styles from "./passwords.module.scss";

const STRONG_PASSWORD_LEVEL = 4;
const MODERATE_PASSWORD_LEVEL = 3;

type PasswordFeedback = {
	warning?: string;
	suggestions?: string[];
};

const getTitle = (feedback: PasswordFeedback | null) => {
	let text: string[] = [];
	if (feedback?.warning) {
		text.push(feedback.warning);
	}
	if (feedback?.suggestions) {
		text = text.concat(feedback.suggestions);
	}
	return text.join(" ");
};

const getIcon = (level: number, feedback: PasswordFeedback | null) => {
	const title = getTitle(feedback);
	if (level >= STRONG_PASSWORD_LEVEL) {
		return <SecureIcon className="text-success" title={title} />;
	}
	if (level >= MODERATE_PASSWORD_LEVEL) {
		return <SecurityWarningIcon className="text-warning" title={title} />;
	}
	return <InsecureIcon className="text-danger" title={title} />;
};

type PasswordStrengthInputProps = React.ComponentPropsWithoutRef<typeof FormControl> & {
	className?: string;
	controlId?: string;
	id?: string;
	name?: string;
};

const ReflessPasswordStrenghtInput = (
	// eslint-disable-next-line no-unused-vars
	{ className, controlId, id, ...props }: PasswordStrengthInputProps,
	ref: React.ForwardedRef<HTMLInputElement>,
) => {
	const [level, setLevel] = useState<number>(0);
	const [feedback, setFeedback] = useState<PasswordFeedback | null>(null);
	const { t } = useTranslation();
	const { watch } = useFormContext();
	const icon = getIcon(level, feedback);

	let value: string | undefined;
	if (props.name) {
		const watched = watch(props.name);
		value = typeof watched === "string" ? watched : undefined;
	}

	const scoreWords = [
		t("password-dangerous"),
		t("password-weak"),
		t("password-okay"),
		t("password-good"),
		t("password-strong"),
	];
	return (
		<InputGroup className={classnames("f-input", styles.size, className)}>
			<FormControl {...props} ref={ref} />
			<InputGroupText>
				{icon}
				<PasswordStrengthBar
					className={styles.strengthBar}
					password={value || ""}
					scoreWords={scoreWords}
					onChangeScore={(score: number, newFeedback: PasswordFeedback) => {
						setLevel(score);
						setFeedback(newFeedback);
					}}
					shortScoreWord={t("password-too-short")}
				/>
			</InputGroupText>
		</InputGroup>
	);
};

export const PasswordStrengthInput = forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
	ReflessPasswordStrenghtInput,
);
