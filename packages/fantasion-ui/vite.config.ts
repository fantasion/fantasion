import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Plugin to add "use client" directive to output files
function applyClientDirective(): Plugin {
	return {
		name: "use-client-directive",
		generateBundle(options, bundle) {
			for (const chunk of Object.values(bundle)) {
				if (chunk.type === "chunk") {
					chunk.code = `"use client";\n${chunk.code}`;
				}
			}
		},
	};
}

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ["index.ts", "**/*.{ts,tsx}", "scss-modules.d.ts"],
			beforeWriteFile: (filePath, content) => {
				// Don't generate .d.ts for SCSS modules - they're handled by scss-modules.d.ts
				if (filePath.includes(".module.scss")) {
					return false;
				}
				return { filePath, content };
			},
		}),
		applyClientDirective(),
	],
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, "index.ts"),
			name: "FantasionUI",
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime", "react-markdown", "rehype-shift-heading"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
