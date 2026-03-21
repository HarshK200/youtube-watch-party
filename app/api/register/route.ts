import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { firstname, lastname, email, password } = await req.json();
  // NOTE: ZOD validation on user sent data
  const userSchema = z.object({
    firstname: z.string().min(3).max(15),
    lastname: z.string().min(3).max(15),
    email: z.email(),
    password: z.string().min(3),
  });
  const reqUserData = { firstname, lastname, email, password };
  const validatedUser = userSchema.safeParse(reqUserData);
  if (!validatedUser.success) {
    return NextResponse.json(
      {
        error: validatedUser.error,
      },
      { status: 422 },
    );
  }

  // NOTE: checking if user with same email already exists or not?
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered." },
      { status: 409 },
    );
  }

  try {
    const hashedPassword = await hash(validatedUser.data.password, 10);

    const dbUser = await prisma.user.create({
      data: {
        firstname: validatedUser.data.firstname,
        lastname: validatedUser.data.lastname,
        email: validatedUser.data.email,
        password_hash: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        msg: "new user created successfully",
        user_id: dbUser.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Internal server error",
        error: err,
      },
      { status: 500 },
    );
  }
}
