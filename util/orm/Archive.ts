import { AllTaskValueType } from "@/type";
import pool from "../db";

export async function fetchArchivedTasks(
  userId: string
): Promise<AllTaskValueType[]> {
  const query = `
    SELECT * FROM tasktidy.task 
    WHERE "userId" = ($1)
    AND status IN ('complete', 'cancel')
  `;

  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching archived tasks:", error);
    throw error;
  }
}
