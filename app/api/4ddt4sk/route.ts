import { InsertTaskValueType } from "@/type";
import { CreateId } from "@/util/functions/helperFunciton";
import { CreateNewTask } from "@/util/orm/Tasks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const dueDate = new Date(data.dueDate);

    // Append the ending time of the due date, as of now the user cant add the time for the due date
    dueDate.setHours(23, 59, 59, 999);

    // adding additional object for task value before inserting in the database
    const taskData: InsertTaskValueType = {
      taskId: CreateId<string>(),
      status: "to do",
      dateCreated: new Date(),
      ...data,
      dueDate: dueDate,
    };

    console.log({ ...taskData });

    // will insert the task data in the
    await CreateNewTask<InsertTaskValueType>(taskData);

    return NextResponse.json(
      { message: "New task added successfully" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in Adding new task", err.message);

    return NextResponse.json(
      { message: `${err.message as string}` },
      { status: 500 }
    );
  }
}
