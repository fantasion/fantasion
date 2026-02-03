import process from "node:process";
import { createServer } from "http";
import next from "next";

const DEFAULT_PORT = 3000;
const PARSE_RADIX = 10;

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT ? Number.parseInt(process.env.PORT, PARSE_RADIX) : DEFAULT_PORT;
const hostname = process.env.FRONTEND_HOST || "localhost";
const app = next({ dev: dev, hostname: hostname, port: port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => handle(req, res)).listen(port, () => {
		// biome-ignore lint/suspicious/noConsole: Server startup message
		console.log(`> Ready on http://localhost:${port}`);
	});
});
