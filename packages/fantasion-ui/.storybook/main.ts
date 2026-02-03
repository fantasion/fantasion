import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: [
		{
			directory: "..",
			files: "**/*.stories.@(js|jsx|mjs|ts|tsx)",
			titlePrefix: "",
		},
		{
			directory: "../styles",
			files: "*.mdx",
			titlePrefix: "Design System",
		},
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	viteFinal: (config) => {
		// Ensure CSS modules work in Storybook
		if (config.css) {
			config.css.modules = {
				localsConvention: "camelCase",
			};
		}
		return config;
	},
};

export default config;
