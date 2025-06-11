import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ message: "Method not allowed!" }, { status: 400 });
}

interface CaseCreateData {
  caseTitle: string;
  attorney: string;
  defendant: string;
}

export async function POST(request: Request) {
  const body: CaseCreateData = await request.json();
  const result = await prisma.case.create({
    data: { ...body },
  });
  return NextResponse.json(result.id);
}
