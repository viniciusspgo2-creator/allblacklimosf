import { NextResponse } from "next/server";
import { ZipArchive } from "archiver";
import { statSync } from "fs";
import { join, relative } from "path";
import { readdirSync } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only available in development
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Not available in production" }, { status: 403 });
  }

  const projectRoot = process.cwd();

  // Directories and files to exclude from the ZIP
  const excludeDirs = new Set([
    "node_modules",
    ".next",
    ".git",
    "upload",
    "skills",
    "tests",
    "mini-services",
    "examples",
    "download",
    ".zscripts",
  ]);
  const excludeFiles = new Set([
    "dev.log",
    "server.log",
    "dev.out.log",
    "bun.lock",
    ".DS_Store",
    ".env", // Never include real env file (contains secrets)
    ".env.local",
    ".env.production",
    ".env.development",
  ]);
  const excludePatterns = [
    /\.db$/,
    /\.db-journal$/,
    /\.log$/,
  ];

  // Collect all files recursively
  const files: string[] = [];
  function walk(dir: string, base: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relPath = relative(base, fullPath);

      if (entry.isDirectory()) {
        if (excludeDirs.has(entry.name)) continue;
        // Skip hidden directories except .env.example
        if (entry.name.startsWith(".") && entry.name !== ".env.example") continue;
        walk(fullPath, base);
      } else if (entry.isFile()) {
        if (excludeFiles.has(entry.name)) continue;
        if (excludePatterns.some((p) => p.test(entry.name))) continue;
        files.push(relPath);
      }
    }
  }

  walk(projectRoot, projectRoot);

  // Create ZIP archive
  const archive = new ZipArchive({ zlib: { level: 9 } });

  // Collect errors
  const errors: string[] = [];
  archive.on("warning", (err: { code?: string; message: string }) => {
    if (err.code !== "ENOENT") errors.push(err.message);
  });
  archive.on("error", (err: Error) => {
    errors.push(err.message);
  });

  // Add files to archive
  for (const file of files) {
    try {
      const fullPath = join(projectRoot, file);
      const stat = statSync(fullPath);
      if (stat.size < 50 * 1024 * 1024) {
        // Skip files larger than 50MB (videos, etc.)
        archive.file(fullPath, { name: file });
      }
    } catch {
      // skip unreadable files
    }
  }

  // Finalize the archive
  archive.finalize();

  // Convert archive stream to a Response
  const stream = new ReadableStream({
    start(controller) {
      archive.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      archive.on("end", () => {
        controller.close();
      });
      archive.on("error", (err: Error) => {
        controller.error(err);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="all-black-limo-sf.zip"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Not available in production" }, { status: 403 });
  }
  return NextResponse.json({
    ok: true,
    message: "Dev download endpoint is active. Use POST to download the project ZIP.",
  });
}
