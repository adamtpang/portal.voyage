import { spawn } from "node:child_process";
import { createServer } from "node:net";

function availablePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      probe.close((error) => {
        if (error) reject(error);
        else resolve(address.port);
      });
    });
  });
}

async function waitForServer(url, server, log) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before tests started.\n${log.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}.\n${log.join("")}`);
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const serverLog = [];
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--turbopack", "-p", String(port)],
  {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => serverLog.push(chunk.toString()));
server.stderr.on("data", (chunk) => serverLog.push(chunk.toString()));

let testExitCode = 1;
try {
  await waitForServer(baseUrl, server, serverLog);
  testExitCode = await new Promise((resolve, reject) => {
    const tests = spawn(process.execPath, ["--test", "tests/site-contract.test.mjs"], {
      env: { ...process.env, SITE_TEST_BASE_URL: baseUrl },
      stdio: "inherit",
    });
    tests.once("error", reject);
    tests.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
}

process.exitCode = testExitCode;
