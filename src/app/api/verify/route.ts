import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseNo = searchParams.get("caseNo");
  const hash = searchParams.get("hash");

  if (!caseNo || !hash) {
    return NextResponse.json(
      { error: "Case number and hash are required" },
      { status: 400 }
    );
  }

  try {
    const caseId = parseInt(caseNo);

    if (isNaN(caseId)) {
      return NextResponse.json(
        { error: "Invalid case number" },
        { status: 400 }
      );
    }

    const file = await prisma.file.findFirst({
      where: {
        hash: hash,
        version: {
          caseId: caseId,
        },
      },
      select: {
        id: true,
      },
    });
    console.log(file);
    const isValid = !!file;

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
