import { Role } from "@/app/generated/prisma/enums";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // NOTE: create a watchparty row in the db and current user as it Host
  const watchParty = await prisma.watchParty.create({
    data: {
      youtubeLink: "",
      members: {
        create: {
          userId: userId,
          role: Role.HOST,
        },
      },
    },
  });

  return NextResponse.json(
    { message: "Watchparty created successfully", watchPartyId: watchParty.id },
    { status: 201 },
  );
}
