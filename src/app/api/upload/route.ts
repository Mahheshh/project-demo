import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const fileSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  hash: z.string(),
  dataSource: z.string(), // blob
});

const uploadBodySchema = z.object({
  caseNo: z.number(),
  files: z.array(fileSchema),
});

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST request received for file upload");

    const body = await req.json();

    const validation = uploadBodySchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation failed:", validation.error.errors);
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { caseNo, files } = validation.data;
    console.log(
      "Validated data - caseNo:",
      caseNo,
      "files count:",
      files.length
    );

    console.log(files[0].dataSource.length, files[0].dataSource.slice(0, 15));

    const existingCase = await prisma.case.findUnique({
      where: { id: caseNo },
      select: {
        id: true,
        versions: {
          select: {
            versionNo: true,
          },
          orderBy: {
            versionNo: "desc",
          },
          take: 1,
        },
      },
    });

    if (!existingCase) {
      console.log("Case not found for caseNo:", caseNo);
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    console.log("Existing case found:", existingCase);

    const lastVersionNo = existingCase.versions[0]?.versionNo || 0;
    const newVersionNo = lastVersionNo + 1;
    console.log("Creating new version:", newVersionNo);

    const result = await prisma.$transaction(
      async (tx) => {
        console.log("Starting transaction");

        const newVersion = await tx.version.create({
          data: {
            versionNo: newVersionNo,
            caseId: existingCase.id,
          },
        });
        console.log("New version created:", newVersion);

        const createdFiles = await tx.file.createMany({
          data: files.map((file) => ({
            fileName: file.fileName,
            fileType: file.fileType,
            hash: file.hash,
            dataSource: file.dataSource,
            versionId: newVersion.id,
          })),
        });
        console.log("Files created, count:", createdFiles.count);

        return {
          version: newVersion,
          filesCreated: createdFiles.count,
        };
      },
      { timeout: 500000 }
    );

    console.log("Transaction completed successfully");

    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        version: result.version,
        filesUploaded: result.filesCreated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        message: "Failed to upload files",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
