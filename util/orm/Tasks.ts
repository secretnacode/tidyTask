import { InsertTaskValueType } from "@/type";
import pool from "../db";

export async function CreateNewTask<T extends InsertTaskValueType>(
  data: T
): Promise<void> {
  try {
    await pool.query('SET timezone = "Asia/Manila"');

    await pool.query(
      `insert into tasktidy.task ("taskId", "userId", "taskName", "taskDesc", "priorityLvl", "status", "category", "dateCreated", "dueDate") values (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9))`,
      [
        data.taskId,
        data.userId,
        data.taskName,
        data.taskDescription,
        data.priority,
        data.status,
        data.category,
        data.dateCreated,
        data.dueDate,
      ]
    );

    console.log(`date: ${data.dueDate}`);

    return;
  } catch (error) {
    const err = error as Error;
    console.error("Error creating new user", error);
    throw new Error(`Error creating new user ${err.message as string}`);
  }
}

export async function GetAllToDoTask<T extends { userId: string }>(data: T) {
  try {
    const res = await pool.query(
      `select "taskId", "taskName", "taskDesc", "priorityLvl", "status", "category", "dueDate" from tasktidy.task where "userId" = ($1) and "status" != ($2) and "status" != ($3)`,
      [data.userId, "complete", "cancel"]
    );

    return res.rows;
  } catch (error) {
    const err = error as Error;
    console.error("Error getting all username", error);
    throw new Error(`Error getting all username ${err.message as string}`);
  }
}

export async function UpdateTaskStatus(
  data: { status: string },
  taskId: string
) {
  try {
    await pool.query(
      `update tasktidy.task set "status" = ($1) where "taskId" = ($2)`,
      [data.status, taskId]
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in updating the status into overdue", error);
    throw new Error(
      `Error in updating the status into overdue ${err.message as string}`
    );
  }
}
