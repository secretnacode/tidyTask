import { LoginPostType } from "@/type/responseType/userAuthType";
import {
  CheckPassword,
  UsernameExist,
} from "@/util/functions/validateBackFunction";
import { GetUserByUsername } from "@/util/orm/UserAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<LoginPostType>> {
  try {
    const data = await req.json();

    const checkUser = await UsernameExist(data.username);

    // will return an error if theres no user existing in the database
    if (!checkUser.isExist) throw new Error(`Sign up first!!!`);

    // get username if the username exist
    const userData = await GetUserByUsername(data.username);

    // validate the user password first and the hashedpassowrd if it match or not
    const isMatch = await CheckPassword({
      password: data.password,
      hashPass: userData.password,
    });

    if (!isMatch) throw new Error(`Wrong password`);

    return NextResponse.json(
      { message: `User Credentials Valid`, userId: userData?.userId },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in log in", err.message);

    return NextResponse.json(
      { message: `${err.message as string}` },
      { status: 500 }
    );
  }
}
