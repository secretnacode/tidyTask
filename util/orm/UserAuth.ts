import { NewUserAuth } from "@/type";
import pool from "../db";
import {
  GetAllUsenameType,
  GetUserByUsernameType,
} from "@/type/ormType/UserAuthType";

export async function CreateNewUser(data: NewUserAuth) {
  try {
    await pool.query(
      `insert into tasktidy.user ("userId", "username", "password", "createdAt") values ($1, $2, $3, $4)`,
      [data.id, data.username, data.password, data.createdAt]
    );

    return;
  } catch (error) {
    const err = error as Error;
    console.error("Error creating new user", error);
    throw new Error(`Error creating new user ${err.message as string}`);
  }
}

export async function GetAllUsename(): Promise<GetAllUsenameType[]> {
  try {
    const res = await pool.query(`select "username" from tasktidy.user`);

    return res.rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error getting all username", error);
    throw new Error(`Error getting all username ${err.message as string}`);
  }
}

export async function GetUserByUsername(
  username: string
): Promise<GetUserByUsernameType> {
  try {
    const res = await pool.query(
      `select "userId", "username", "password" from tasktidy.user where "username" = ($1)`,
      [username]
    );

    return res.rows[0];
  } catch (error) {
    const err = error as Error;
    console.error("Error getting user value by username", error);
    throw new Error(
      `Error getting user value by username ${err.message as string}`
    );
  }
}
