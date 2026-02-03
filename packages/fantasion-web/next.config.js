import process from "node:process";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";
import { defaultLang, getRewrites } from "./routes.js";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const { version } = packageJson;

const baseDomain = process.env.FRONTEND_HOST || "fantasion.cz";
const apiUrl = process.env.API_URL || "http://localhost:8000/api/v1";
const typoDomains = ["fantazion.cz", "www.fantazion.cz", "www.fantasion.cz"];
const oneYear = 31_536_000;
const securityHeaders = [
	{ key: "X-DNS-Prefetch-Control", value: "on" },
	{
		key: "Strict-Transport-Security",
		value: `max-age=${oneYear}; includeSubdomains; preload`,
	},
];

/**
 * @type {import('next').NextConfig}
 */
export default withNextIntl({
	assetPrefix: process.env.STATIC_ROOT ? `${process.env.STATIC_ROOT}/web/${version}` : "",
	reactStrictMode: true,
	trailingSlash: true,
	sassOptions: {
		includePaths: [resolve(__dirname, "..", "..")],
		silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "color-functions", "if-function"],
	},
	turbopack: {
		root: resolve(__dirname, "..", ".."),
	},
	// Exclude packages that use worker_threads from being bundled by Turbopack
	serverExternalPackages: ["flexsearch"],
	env: {
		API_URL: apiUrl,
		FRONTEND_HOST: baseDomain,
		DEFAULT_LANG: defaultLang,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			...(process.env.STATIC_ROOT
				? [
						{
							protocol: "https",
							hostname: new URL(process.env.STATIC_ROOT).hostname,
						},
					]
				: []),
		],
	},
	headers: async () => [
		{
			source: "/:path*",
			headers: securityHeaders,
		},
	],
	redirects: async () => [
		{
			source: "/:path*",
			permanent: true,
			has: [
				{
					type: "host",
					value: `(${typoDomains.join("|")})`,
				},
			],
			destination: `https://${baseDomain}/:path*`,
		},
	],
	rewrites: async () => getRewrites(),
});
