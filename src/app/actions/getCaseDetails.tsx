"use server";
import { prisma } from "@/lib/prisma";

async function getCaseDetails(id: string) {
  try {
    const caseId = parseInt(id);
    if (isNaN(caseId)) {
      return null;
    }

    const caseData = await prisma.case.findUnique({
      where: {
        id: caseId,
      },
      include: {
        versions: {
          include: {
            files: true,
          },
          orderBy: {
            versionNo: 'asc',
          },
        },
      },
    });

    return caseData;
  } catch (error) {
    console.error("Error fetching case details:", error);
    return null;
  }
}


export default getCaseDetails;