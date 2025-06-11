import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  const { page = 1 } = await req.json();
  const take = 10;
  const skip = (page - 1) * take;

  try {
    const [records, total] = await Promise.all([
      prisma.case.findMany({
        skip,
        take,
        orderBy: {
          id: "desc",
        },
        include: {
          versions: {
            include: {
              files: true,
            },
            orderBy: {
              versionNo: "asc",
            },
          },
        },
      }),
      prisma.case.count(),
    ]);

    // Calculate additional statistics for each case
    const recordsWithStats = records.map((record) => ({
      ...record,
      totalVersions: record.versions.length,
      totalFiles: record.versions.reduce((total, version) => total + version.files.length, 0),
      latestVersion: record.versions.length > 0 ? Math.max(...record.versions.map(v => v.versionNo)) : 0,
    }));

    return NextResponse.json(
      {
        records: recordsWithStats,
        total,
        page,
        totalPages: Math.ceil(total / take),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}