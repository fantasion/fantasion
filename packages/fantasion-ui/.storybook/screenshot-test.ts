#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import pixelmatch from "pixelmatch";
import { chromium, type Page } from "playwright";
import { PNG } from "pngjs";

const STORYBOOK_URL = process.env.STORYBOOK_URL || "http://localhost:6006";
const SCREENSHOTS_DIR = join(__dirname, "screenshots");
const BASELINES_DIR = join(SCREENSHOTS_DIR, "baselines");
const ACTUAL_DIR = join(SCREENSHOTS_DIR, "actual");
const DIFF_DIR = join(SCREENSHOTS_DIR, "diff");
const UPDATE_BASELINES = process.argv.includes("--update-baselines");

interface Story {
	id: string;
	kind: string;
	name: string;
	title: string;
}

// Ensure directories exist
[SCREENSHOTS_DIR, BASELINES_DIR, ACTUAL_DIR, DIFF_DIR].forEach((dir) => {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
});

async function getStories(): Promise<Story[]> {
	const response = await fetch(`${STORYBOOK_URL}/stories.json`);
	const data = await response.json();

	return Object.entries(data.stories || {}).map(([id, story]: [string, any]) => ({
		id,
		kind: story.kind,
		name: story.name,
		title: story.title,
	}));
}

async function captureStoryScreenshot(page: Page, story: Story): Promise<Buffer> {
	const storyUrl = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;
	await page.goto(storyUrl, { waitUntil: "networkidle" });

	// Wait for story to render
	await page.waitForSelector("#storybook-root", { timeout: 10_000 });

	// Additional wait for any animations
	await page.waitForTimeout(500);

	const screenshot = await page.screenshot({
		type: "png",
		fullPage: false,
	});

	return screenshot;
}

function compareScreenshots(baseline: Buffer, actual: Buffer): { diff: Buffer; mismatchPercentage: number } | null {
	try {
		const img1 = PNG.sync.read(baseline);
		const img2 = PNG.sync.read(actual);

		const { width, height } = img1;

		// Images must have same dimensions
		if (img2.width !== width || img2.height !== height) {
			console.warn(`Image dimensions differ. Baseline: ${width}x${height}, Actual: ${img2.width}x${img2.height}`);
			return null;
		}

		const diff = new PNG({ width, height });

		const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

		const totalPixels = width * height;
		const mismatchPercentage = (numDiffPixels / totalPixels) * 100;

		return {
			diff: PNG.sync.write(diff),
			mismatchPercentage,
		};
	} catch (error) {
		console.error("Error comparing screenshots:", error);
		return null;
	}
}

function sanitizeFilename(name: string): string {
	return name
		.replace(/[^a-z0-9]/gi, "-")
		.replace(/-+/g, "-")
		.toLowerCase();
}

async function main() {
	console.log("🚀 Starting screenshot testing...");
	console.log(`📍 Storybook URL: ${STORYBOOK_URL}`);
	console.log(`📁 Screenshots directory: ${SCREENSHOTS_DIR}`);
	console.log(`🔄 Update baselines: ${UPDATE_BASELINES}`);

	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: 1200, height: 768 },
	});
	const page = await context.newPage();

	try {
		const stories = await getStories();
		console.log(`📚 Found ${stories.length} stories\n`);

		let passCount = 0;
		let failCount = 0;
		let newCount = 0;

		for (const story of stories) {
			const filename = `${sanitizeFilename(story.kind)}-${sanitizeFilename(story.name)}.png`;
			const baselinePath = join(BASELINES_DIR, filename);
			const actualPath = join(ACTUAL_DIR, filename);
			const diffPath = join(DIFF_DIR, filename);

			process.stdout.write(`📸 ${story.title} › ${story.name}... `);

			try {
				const screenshot = await captureStoryScreenshot(page, story);
				writeFileSync(actualPath, screenshot);

				if (UPDATE_BASELINES) {
					writeFileSync(baselinePath, screenshot);
					console.log("✅ Baseline updated");
					newCount++;
					continue;
				}

				if (!existsSync(baselinePath)) {
					writeFileSync(baselinePath, screenshot);
					console.log("🆕 New baseline created");
					newCount++;
					continue;
				}

				const baseline = readFileSync(baselinePath);
				const comparison = compareScreenshots(baseline, screenshot);

				if (!comparison) {
					console.log("⚠️  Comparison failed (dimension mismatch)");
					failCount++;
					continue;
				}

				const { diff, mismatchPercentage } = comparison;

				if (mismatchPercentage > 0.5) {
					writeFileSync(diffPath, diff);
					console.log(`❌ Failed (${mismatchPercentage.toFixed(2)}% difference)`);
					failCount++;
				} else {
					console.log(`✅ Passed (${mismatchPercentage.toFixed(2)}% difference)`);
					passCount++;
				}
			} catch (error) {
				console.log(`❌ Error: ${error.message}`);
				failCount++;
			}
		}

		console.log("\n📊 Summary:");
		console.log(`   ✅ Passed: ${passCount}`);
		console.log(`   ❌ Failed: ${failCount}`);
		console.log(`   🆕 New/Updated: ${newCount}`);

		if (failCount > 0) {
			console.log(`\n⚠️  ${failCount} screenshots differ from baselines.`);
			console.log(`   Check diff images in: ${DIFF_DIR}`);
			process.exit(1);
		}

		console.log("\n✨ All screenshots match baselines!");
	} catch (error) {
		console.error("\n❌ Screenshot testing failed:", error);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

main();
