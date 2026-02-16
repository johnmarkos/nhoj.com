#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lintEntrypoint = path.join(__dirname, "content-lint.cjs");

const result = spawnSync(
  process.execPath,
  [lintEntrypoint, ...process.argv.slice(2)],
  {
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(`Failed to run ${lintEntrypoint}: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
