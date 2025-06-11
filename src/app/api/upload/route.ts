import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

interface UploadBody {
  caseNo: number;
  hashList: string[];
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { caseNo, hashList } = body as UploadBody;

  const existingCase = await prisma.case.findUnique({
    where: { id: caseNo },
    include: { versions: true },
  });

  if (!existingCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const lastVersion = existingCase.versions.reduce(
    (max: number, version: { versionNo: number }) =>
      version.versionNo > max ? version.versionNo : max,
    0
  );

  const newVersion = await prisma.version.create({
    data: {
      versionNo: lastVersion + 1,
      caseId: existingCase.id,
      hashes: hashList,
    },
  });

  return NextResponse.json({ version: newVersion }, { status: 201 });
}
