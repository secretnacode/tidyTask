import pool from "@/util/db";
import { GetAllToDoTask } from "@/util/orm/Tasks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = (await params).userId;

    const res = await GetAllToDoTask<{ userId: string }>({ userId });

    return NextResponse.json(
      { message: "New task added successfully", data: res },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in Getting all the tasks", err.message);

    return NextResponse.json(
      { message: `${err.message as string}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await req.json();
    const taskId = (await params).userId;

    console.log("Received update data:", data); // Debug log
    console.log("Task ID:", taskId); // Debug log

    const result = await pool.query(
      `
      UPDATE tasktidy.task SET "taskName" = ($1), category = ($2), "priorityLvl" = ($3), "dueDate" = ($4), "status" = ($5) WHERE "taskId" = ($6)
    `,
      [
        data.taskName,
        data.category,
        data.priorityLvl,
        data.dueDate,
        data.status,
        taskId,
      ]
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
    console.error("Server error:", error); // Debug log
    return NextResponse.json(
      { message: "Error updating task", error: (error as Error).message },
      { status: 500 }
    );
  }
}
