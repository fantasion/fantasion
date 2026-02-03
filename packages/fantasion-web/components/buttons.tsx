"use client";

import { CopyButton as UICopyButton } from "@fantasion/ui";
import { CopyIcon } from "../content/icons";
import { useTranslation } from "../lib/i18n-context";
import styles from "./buttons.module.scss";

export const CopyButton = ({ value }: { value: string }) => {
	const { t } = useTranslation();
	return <UICopyButton value={value} copyIcon={CopyIcon} copiedLabel={t("copied")} className={styles.copyButton} />;
};

// Re-export from @fantasion/ui for convenience
export { InteractiveButton, type InteractiveButtonProps } from "@fantasion/ui";
