"use client";

import { AllTaskValueType } from "@/type";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { formatingDate } from "@/util/functions/helperFunciton";

export interface AllTaskValueType2 {
  taskId: string;
  taskName: string;
  category: string;
  priorityLvl: string;
  status: string;
  dueDate: string;
  updatedAt: string;
  userId: string;
}

export function ArchivedTaskTable({
  taskVal,
}: {
  taskVal: AllTaskValueType[];
}) {
  const [tasks, setTasks] = useState(taskVal);

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left p-4">Task Name</th>
          <th className="text-left p-4">Category</th>
          <th className="text-left p-4">Priority</th>
          <th className="text-left p-4">Status</th>
          <th className="text-left p-4">Due Date</th>
          <th className="text-left p-4">Completed/Cancelled Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.taskId} className="border-t">
            <td className="p-4">{task.taskName}</td>
            <td className="p-4 capitalize">{task.category}</td>
            <td className="p-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  task.priorityLvl === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priorityLvl === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {task.priorityLvl}
              </span>
            </td>
            <td className="p-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  task.status === "complete"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {task.status === "complete" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                {task.status}
              </span>
            </td>
            <td className="p-4">
              {task.dueDate && <>{formatingDate(task.dueDate, 0)}</>}
            </td>
            <td className="p-4">
              {task.dueDate && <>{formatingDate(task.dueDate, 0)}</>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
