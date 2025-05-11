import { GetAllUsename } from "../orm/UserAuth";

export async function UsernameExist(
  username: string
): Promise<{ message: string; isExist: boolean }> {
  try {
    const res = await GetAllUsename();

    for (const user of res) {
      if (user.username === username)
        return {
          message: "Username already exists",
          isExist: true,
        };
    }

    return {
      message: "Username does not exist",
      isExist: false,
    };
  } catch (error) {
    const err = error as Error;
    console.error("Error checking username existence", error);
    throw Error(`Error checking username existence ${err.message as string}`);
  }
}
