import { spawn } from "node:child_process";
import { loadEnvFile } from "node:process";

loadEnvFile(".env.game");

const command = process.argv[2] || "dev";
const nextArgs = ["node_modules/next/dist/bin/next", command, ...process.argv.slice(3)];
const child = spawn(process.execPath, nextArgs, {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
