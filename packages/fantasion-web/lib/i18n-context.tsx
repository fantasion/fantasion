import { useLocale as nextIntlUseLocale, useTranslations as nextIntlUseTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";

export type Locale = "cs" | "en";

// Re-export useTranslations for direct use
export { useLocale, useTranslations } from "next-intl";

// Compatibility wrapper for code using the old useTranslation pattern
export function useTranslation() {
	const t = nextIntlUseTranslations();
	const locale = nextIntlUseLocale();

	return {
		t: (key: string, params?: Record<string, string | number>) => t(key, params),
		i18n: {
			language: locale,
			locale: locale as Locale,
		},
	};
}

// Trans component for interpolation with components
type TransProps = {
	i18nKey: string;
	values?: Record<string, string | number>;
	components?: ReactElement[];
};

export function Trans({ i18nKey, values, components }: TransProps): ReactNode {
	const t = nextIntlUseTranslations();

	// Get the translated string
	const text = t(i18nKey, values);

	// If no components, return text as-is
	if (!components || components.length === 0) {
		return text;
	}

	// Replace <0>...</0>, <1>...</1>, etc. with components
	const result: ReactNode[] = [];
	let lastIndex = 0;

	const regex = /<(\d+)>([^<]*)<\/\1>/g;
	let match: RegExpExecArray | null;

	// biome-ignore lint/suspicious/noAssignInExpressions: Idiomatic regex matching pattern
	while ((match = regex.exec(text)) !== null) {
		// Add text before the match
		if (match.index > lastIndex) {
			result.push(text.slice(lastIndex, match.index));
		}

		const componentIndex = Number.parseInt(match[1], 10);
		const innerText = match[2];
		const component = components[componentIndex];

		if (component) {
			// Clone the component with the inner text as children
			const componentProps = component.props as Record<string, unknown>;
			const { children: _unused, ...restProps } = componentProps;
			const clonedComponent = {
				...component,
				props: { ...restProps, children: innerText },
				key: `trans-${componentIndex}`,
			};
			result.push(clonedComponent);
		} else {
			// No component found, just use the inner text
			result.push(innerText);
		}

		lastIndex = regex.lastIndex;
	}

	// Add remaining text after the last match
	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result.length === 1 ? result[0] : result;
}
