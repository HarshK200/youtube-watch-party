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

  // validate partyId sent by user
  const { partyId } = await req.json();
  if (!partyId) {
    return NextResponse.json({ message: "Invalid partyId" }, { status: 422 });
  }
  const watchPartyDB = await prisma.watchParty.findUnique({
    where: { id: partyId },
  });
  if (!watchPartyDB) {
    return NextResponse.json(
      { message: "WatchParty not found" },
      { status: 404 },
    );
  }

  // NOTE: create a watchPartyMember entry and make the user as a member
  const newWatchPartyMember = await prisma.watchpartyMember.create({
    data: {
      userId: userId,
      watchPartyId: partyId,
      role: Role.VIEWER,
    },
  });
  if (!newWatchPartyMember) {
    return NextResponse.json(
      { message: "Unable to create watchPartyMember" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Joined watchparty successfully",
      watchPartyId: partyId,
    },
    { status: 201 },
  );
}
