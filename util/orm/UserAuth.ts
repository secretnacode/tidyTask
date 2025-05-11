import { NewUserAuth } from "@/type";
import pool from "../db";

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

export async function GetAllUsename(): Promise<{ username: string }[]> {
  try {
    const res = await pool.query(`select "username" from tasktidy.user`);

    return res.rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error getting all username", error);
    throw new Error(`Error getting all username ${err.message as string}`);
  }
}
