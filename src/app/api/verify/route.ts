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
    const record = await prisma.case.findUnique({
      where: { id: parseInt(caseNo) },
      include: {
        versions: true,
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    let isValid = false;

    for (const version of record.versions) {
      if (version.hashes.includes(hash)) {
        isValid = true;
        break;
      }
    }

    return NextResponse.json({ isValid });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
