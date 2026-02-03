#!/usr/bin/env node

import process from "node:process";
import { readdir } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDir = path.resolve(__dirname, "..", ".next", "static");
const staticDest = `web/${version}/_next/static`;
const gcpProject = process.env.GCP_PROJECT;
const gsCredentials = process.env.GS_CREDENTIALS;

// We'll validate first, then assert a concrete `string` for TypeScript.
let bucketPublic = process.env.BUCKET_PUBLIC;

if (!gcpProject) {
	throw new Error("Missing required env var: GCP_PROJECT");
}
if (!gsCredentials) {
	throw new Error("Missing required env var: GS_CREDENTIALS");
}
if (!bucketPublic) {
	throw new Error("Missing required env var: BUCKET_PUBLIC");
}
// After the runtime guard above, this is safe.
bucketPublic = bucketPublic as string;

const storage = new Storage({
	projectId: gcpProject,
	credentials: JSON.parse(gsCredentials),
});

async function* getDirectoryFiles(dir: string): AsyncGenerator<string> {
	const dirents = await readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = path.resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getDirectoryFiles(res);
		} else {
			yield res;
		}
	}
}

async function uploadFiles({
	bucket,
	dest,
	dir,
}: {
	bucket: ReturnType<Storage["bucket"]>;
	dest: string;
	dir: string;
}): Promise<void> {
	const ops: [string, { destination: string; gzip: boolean }][] = [];
	for await (const file of getDirectoryFiles(dir)) {
		const destination = `${dest}/${path.relative(dir, file)}`;
		// biome-ignore lint/suspicious/noConsole: Script progress output
		console.log(`Collected ${destination}`);
		ops.push([
			file,
			{
				destination: destination,
				gzip: true,
			},
		]);
	}
	await Promise.all(ops.map(([file, options]) => bucket.upload(file, options)));
}

uploadFiles({
	bucket: storage.bucket(bucketPublic),
	dest: staticDest,
	dir: staticDir,
})
	// biome-ignore lint/suspicious/noConsole: Script output
	.then(console.log)
	// biome-ignore lint/suspicious/noConsole: Script error output
	.catch(console.error);
