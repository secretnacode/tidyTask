import pool from "@/util/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const data = await req.json();
    const taskId = (await params).taskId;

    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE tasktidy.task SET "status" = ($1) WHERE "taskId" = ($2)`,
      [data.status, taskId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Task updated successfully",
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Error updating task",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
