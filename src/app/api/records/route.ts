import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  const { page = 1, skip = 0 } = await req.json();
  const take = 10;

  const records = await prisma.case.findMany({
    skip: (page - 1) * take,
    take,
    orderBy: {
      id: "desc",
    },
    include: {
      versions: true,
    },
  });

  const total = await prisma.case.count();

  return NextResponse.json(
    {
      records,
      total,
      page,
      totalPages: Math.ceil(total / take),
    },
    {
      status: 200,
    }
  );
}
