"use client";

import type { AbstractIntlMessages, IntlErrorCode } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

type IntlProviderProps = {
	locale: string;
	messages: AbstractIntlMessages;
	children: ReactNode;
};

function handleError(error: { code: IntlErrorCode }) {
	// Suppress MISSING_MESSAGE errors since we have fallbacks
	if (error.code === "MISSING_MESSAGE") {
		return;
	}
}

function getMessageFallback({ key }: { namespace?: string; key: string }) {
	// Return the key itself as fallback to help identify missing translations
	return key;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}
			timeZone="Europe/Prague"
			onError={handleError}
			getMessageFallback={getMessageFallback}
		>
			{children}
		</NextIntlClientProvider>
	);
}
