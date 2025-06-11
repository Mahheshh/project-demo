import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const caseCreateSchema = z.object({
  caseTitle: z.string().min(1, "Case title is required"),
  attorney: z.string().min(1, "Attorney is required"),
  defendant: z.string().min(1, "Defendant is required"),
});

export async function GET() {
  return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = caseCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { caseTitle, attorney, defendant } = validation.data;

    const newCase = await prisma.case.create({
      data: {
        caseTitle,
        attorney,
        defendant,
      },
    });

    return NextResponse.json({ id: newCase.id }, { status: 201 });
  } catch (error) {
    console.error("Case creation failed:", error);
    return NextResponse.json(
      { message: "Failed to create case", error: error },
      { status: 500 }
    );
  }
}
