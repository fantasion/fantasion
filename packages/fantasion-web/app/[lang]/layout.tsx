import type { Metadata } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

import "@fantasion/ui/ui.css";
import "@/styles/globals.scss";

import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { IntlProvider } from "../../layout/IntlProvider";
import { getCurrentUser } from "../../server/auth";
import { getActiveOrder } from "../../server/order";
import Providers from "./providers";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ lang: locale }));
}

// App Router: move <Head> content from `_document.tsx` here via `metadata` + `links`.
export const metadata: Metadata = {
	title: {
		default: "Fantasion",
		template: "%s | Fantasion",
	},
};

// If you want to compute a base URL, do it from env.
const getMetadataBase = () => {
	// biome-ignore lint/style/noProcessEnv: Server-only environment access
	// biome-ignore lint/correctness/noProcessGlobal: process is a global in Node.js servers
	const host = process.env.FRONTEND_HOST;
	if (!host) {
		return;
	}
	return new URL(`https://${host}`);
};

export const metadataBase = getMetadataBase();

export const viewport = {};

type RootLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
	const { lang } = await params;
	const locale = routing.locales.includes(lang as "cs" | "en") ? lang : routing.defaultLocale;
	setRequestLocale(locale);

	const [messages, user, activeOrder] = await Promise.all([getMessages(), getCurrentUser(), getActiveOrder()]);

	return (
		<html lang={locale}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,700;1,400;1,700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<NextTopLoader color="" showSpinner={false} />
				<IntlProvider locale={locale} messages={messages}>
					<Providers user={user} activeOrder={activeOrder}>
						{children}
					</Providers>
				</IntlProvider>

				{/* biome-ignore lint/correctness/useUniqueElementIds: Script component requires static ID for Next.js */}
				<Script id="fantasion-app-router-marker" strategy="afterInteractive" />
			</body>
		</html>
	);
}
