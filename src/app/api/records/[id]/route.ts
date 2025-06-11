import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const id = parseInt(await params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid case ID" }, { status: 400 });
  }

  try {
    const caseData = await prisma.case.findUnique({
      where: {
        id: id,
      },
      include: {
        versions: {
          orderBy: {
            versionNo: 'desc',
          },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseData);

  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}
