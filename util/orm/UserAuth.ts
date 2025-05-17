import { NewUserAuth } from "@/type";
import pool from "../db";
import {
  GetAllUsenameType,
  GetUserByUsernameType,
} from "@/type/ormType/UserAuthType";
import { NextResponse } from "next/server";

export async function CreateNewUser(data: NewUserAuth) {
  try {
    await pool.query(
      `insert into tasktidy.user ("userId", "username", "password", "createdAt") values (($1), ($2), ($3), ($4))`,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 
      AND status IN ('complete', 'cancelled')
      ORDER BY updated_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return NextResponse.json({
      message: "Archived tasks fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching archived tasks:", error);
    return NextResponse.json(
      { message: "Error fetching archived tasks" },
      { status: 500 }
    );
  }
}
