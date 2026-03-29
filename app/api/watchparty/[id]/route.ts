import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ partyId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { partyId } = await params;
  console.log("PartyId: ", partyId);

  // check if watchparty with id exists in db
  const watchParty = await prisma.watchParty.findUnique({
    where: { id: partyId },
  });
  if (!watchParty)
    return NextResponse.json(
      { message: "WatchParty with id not found" },
      { status: 404 },
    );
  const watchPartyMember = await prisma.watchpartyMember.findUnique({
    where: {
      watchPartyId_userId: {
        watchPartyId: watchParty.id,
        userId: session.user.id,
      },
    },
  });
  if (!watchPartyMember)
    return NextResponse.json(
      {
        message:
          "User is not a memeber of the watchparty, please join the watchparty first",
      },
      { status: 404 },
    );

  return NextResponse.json(
    {
      message: "Validation successfull",
      userId: session.user.id,
      firstname: session.user.firstname,
      lastname: session.user.lastname,
      watchpartyId: watchParty.id,
      watchPartyMemberId: watchPartyMember.id,
      role: watchPartyMember.role,
    },
    { status: 200 },
  );
}
