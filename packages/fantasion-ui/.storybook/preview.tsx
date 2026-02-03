import type { Preview } from "@storybook/react";
import { useEffect } from "react";

// Import global styles for Storybook
import "../styles/index.scss";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: "light",
			values: [
				{
					name: "light",
					value: "#fffaeb",
				},
				{
					name: "dark",
					value: "#212529",
				},
				{
					name: "white",
					value: "#ffffff",
				},
			],
		},
		viewport: {
			viewports: {
				mobile: {
					name: "Mobile (sm)",
					styles: { width: "576px", height: "800px" },
				},
				tablet: {
					name: "Tablet (md)",
					styles: { width: "768px", height: "1024px" },
				},
				desktop: {
					name: "Desktop (lg)",
					styles: { width: "992px", height: "768px" },
				},
				wide: {
					name: "Wide (xl)",
					styles: { width: "1200px", height: "768px" },
				},
				ultrawide: {
					name: "Ultra Wide (xxl)",
					styles: { width: "1400px", height: "768px" },
				},
			},
		},
	},
	globalTypes: {
		theme: {
			description: "Theme for components",
			defaultValue: "light",
			toolbar: {
				title: "Theme",
				icon: "paintbrush",
				items: [
					{ value: "light", title: "Light" },
					{ value: "dark", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme || "light";

			// Apply theme to document root for proper CSS variable cascade
			useEffect(() => {
				const root = document.documentElement;
				root.setAttribute("data-theme", theme);

				// Cleanup: restore to light theme on unmount
				return () => {
					root.setAttribute("data-theme", "light");
				};
			}, [theme]);

			// Sync Storybook background with theme
			const backgroundColor = theme === "dark" ? "#212529" : "#fffaeb";

			return (
				<div style={{ padding: "1rem", backgroundColor }}>
					<Story />
				</div>
			);
		},
	],
};

export default preview;
