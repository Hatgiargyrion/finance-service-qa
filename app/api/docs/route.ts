import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const docsDir = path.join(process.cwd(), "docs");
  const filePath = path.join(docsDir, "openapi-v1.yaml");

  try {
    // debug: lista o que existe em /docs
    const files = await readdir(docsDir);

    const file = await readFile(filePath, "utf-8");

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/yaml; charset=utf-8",
        "X-Debug-DocsDir": docsDir,
        "X-Debug-Files": files.join(","),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Failed to load OpenAPI file",
        docsDir,
        filePath,
        hint:
          "Check if the file name is exactly 'openapi-v1.yaml' (not .yml or .txt).",
        nodeError: {
          code: e?.code,
          message: e?.message,
        },
      },
      { status: 500 }
    );
  }
}