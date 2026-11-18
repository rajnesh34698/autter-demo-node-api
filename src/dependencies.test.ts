import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const lockfile = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
) as {
  packages: Record<string, { version?: string }>;
};

const fixedVersions: Record<string, string> = {
  tinypool: "2.1.2",
  "fast-uri": "3.1.6",
  fastify: "5.12.2",
  "find-my-way": "9.7.0",
  postcss: "8.5.18",
  "source-map-js": "1.2.2",
  vite: "7.3.7",
  zod: "4.6.6",
};

function compareVersions(left: string, right: string): number {
  const a = left.split(".").map((part) => Number.parseInt(part, 10));
  const b = right.split(".").map((part) => Number.parseInt(part, 10));
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

describe("dependency security updates", () => {
  test.each(Object.entries(fixedVersions))(
    "%s is at or above the fixed version",
    (name, fixedVersion) => {
      const installedVersion = lockfile.packages[`node_modules/${name}`]?.version;
      expect(installedVersion).toBeDefined();
      expect(compareVersions(installedVersion as string, fixedVersion)).toBeGreaterThanOrEqual(0);
    },
  );
});
