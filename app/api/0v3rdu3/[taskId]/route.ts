import { UpdateTaskStatus } from "@/util/orm/Tasks";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = (await params).taskId;
    const data = await req.json();

    await UpdateTaskStatus(data, taskId);

    return NextResponse.json(
      { message: "Task status into overdue updated successfully" },
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
