import { HashPassword } from "@/util/functions/authFunction";
import { CreateId } from "@/util/functions/helperFunciton";
import { UsernameExist } from "@/util/functions/validateBackFunction";
import { CreateNewUser } from "@/util/orm/UserAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const checkUser = await UsernameExist(data.username);

    if (checkUser.isExist) throw new Error(checkUser.message);

    const newUser = {
      id: CreateId<string>(),
      username: data.username,
      password: HashPassword(data.password),
      createdAt: new Date(),
    };
    await CreateNewUser(newUser);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in sign up", err.message);

    return NextResponse.json(
      { message: `${err.message as string}` },
      { status: 500 }
    );
  }
}
