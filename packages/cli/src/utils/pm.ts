import { spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  const lockfiles: Array<[string, PackageManager]> = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"],
  ]
  for (const [file, pm] of lockfiles) {
    try {
      await fs.access(path.join(cwd, file))
      return pm
    } catch {
      // keep looking
    }
  }
  return "npm"
}

function installArgs(pm: PackageManager, deps: string[], dev: boolean): string[] {
  switch (pm) {
    case "pnpm":
    case "yarn":
      return ["add", ...(dev ? ["-D"] : []), ...deps]
    case "bun":
      return ["add", ...(dev ? ["-d"] : []), ...deps]
    case "npm":
      return ["install", ...(dev ? ["-D"] : []), ...deps]
  }
}

export function runInstall(
  pm: PackageManager,
  deps: string[],
  dev: boolean,
  cwd: string
): Promise<void> {
  const args = installArgs(pm, deps, dev)
  return new Promise((resolve, reject) => {
    const child = spawn(pm, args, {
      cwd,
      stdio: "inherit",
      // pnpm/yarn/npm are .cmd shims on Windows and need a shell.
      shell: process.platform === "win32",
    })
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${pm} ${args.join(" ")} exited with code ${code}`))
    )
    child.on("error", reject)
  })
}
