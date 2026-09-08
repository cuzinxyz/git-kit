const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const CACHE_FILE = path.join(os.homedir(), ".cache", "gk", "update-check.json");
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}

function isNewer(latest, current) {
  const a = String(latest).split(".").map(Number);
  const b = String(current).split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

function spawnBackgroundCheck(pkgName) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    const child = spawn(process.execPath, [path.join(__dirname, "update-check-worker.js"), pkgName, CACHE_FILE], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  } catch {
    // best-effort only
  }
}

function notify(pkg, ui) {
  const cache = readCache();
  const stale = !cache || Date.now() - (cache.lastCheck || 0) > CHECK_INTERVAL_MS;
  if (stale && !process.env.GK_NO_UPDATE_CHECK) spawnBackgroundCheck(pkg.name);

  if (process.stdout.isTTY && cache && cache.latestVersion && isNewer(cache.latestVersion, pkg.version)) {
    ui.hint(`Update available: ${pkg.version} → ${cache.latestVersion} — run "npm install -g ${pkg.name}" to upgrade.`);
  }
}

module.exports = { notify, isNewer, CACHE_FILE };
