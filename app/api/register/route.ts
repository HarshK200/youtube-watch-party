import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: NextRequest) {
  const { firstname, lastname, email, password } = await req.json();

  try {
    console.log(firstname, lastname, email, password);

    return NextResponse.json(
      {
        msg: "new user created",
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        msg: "Internal server error",
        error: e,
      },
      { status: 500 },
    );
  }
}
