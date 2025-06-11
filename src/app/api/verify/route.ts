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

    const version = await prisma.version.findFirst({
      where: {
        caseId: caseId,
        hashes: {
          has: hash,
        },
      },
    });

    const isValid = !!version;

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
