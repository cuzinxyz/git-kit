#!/usr/bin/env node
const fs = require("node:fs");

async function main() {
  const [pkgName, cacheFile] = process.argv.slice(2);
  if (!pkgName || !cacheFile) return;
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkgName}/latest`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.version) return;
    fs.writeFileSync(cacheFile, JSON.stringify({ lastCheck: Date.now(), latestVersion: data.version }));
  } catch {
    // offline or registry unreachable — skip silently, try again next time
  }
}

main();
