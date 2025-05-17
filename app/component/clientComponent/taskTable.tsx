"use client";

import {
  AllTaskValueType,
  ColumnValType,
  FilterModalVisibility,
  SortValType,
} from "@/type";
import { formatingDate } from "@/util/functions/helperFunciton";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useNotification } from "./providers/notificationProvider";
import { useRouter } from "next/navigation";

export function TaskTable<T extends AllTaskValueType[]>({
  taskVal,
  tobeFilter,
}: {
  taskVal: T;
  tobeFilter: {
    column: string;
    value: string;
  };
}) {
  const [taskData, setTaskData] = useState<AllTaskValueType[]>();
  const [taskDataClone, setTaskDataClone] = useState<AllTaskValueType[]>();
  const [editingTask, setEditingTask] = useState<AllTaskValueType | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Set initial data
    setTaskData(taskVal);

    // Apply filter if both column and value exist
    if (tobeFilter?.column && tobeFilter?.value) {
      const filteredTask = taskVal.filter((task) => {
        const columnValue = task[tobeFilter.column];

        // Handle date comparison separately
        if (tobeFilter.column === "dueDate" && columnValue) {
          const taskDate = new Date(columnValue as string).toLocaleDateString();
          const filterDate = new Date(tobeFilter.value).toLocaleDateString();
          return taskDate === filterDate;
        }

        // Handle regular string comparison
        return (
          String(columnValue).toLowerCase() === tobeFilter.value.toLowerCase()
        );
      });

      setTaskDataClone(filteredTask);
    } else {
      // If no filter, show all tasks
      setTaskDataClone(taskVal);
    }
  }, [taskVal, tobeFilter]);

  const [showFilterModal, setShowFilterModal] = useState<FilterModalVisibility>(
    {
      taskName: false,
      category: false,
      priorityLvl: false,
      status: false,
      dueDate: false,
    }
  );

  const sortVal = {
    sortPriority: new Map([
      ["high", 1],
      ["medium", 2],
      ["low", 3],
    ]),
    sortStatus: new Map([
      ["in progress", 1],
      ["to do", 2],
      ["overdue", 3],
    ]),
    sortCategory: new Map([
      ["work", 1],
      ["study", 2],
      ["home", 3],
      ["personal", 4],
      ["other", 5],
    ]),
  };

  const handleSortTask = useCallback(
    (sortType: SortValType, column: ColumnValType) => {
      if (!taskData) return;

      setShowFilterModal((prev) => ({ ...prev, [column]: !prev[column] }));

      const sortedTask = [...taskData].sort((a, b) => {
        const valA = a[column] as string | Date | undefined;
        const valB = b[column] as string | Date | undefined;

        if (!valA) return 1;
        if (!valB) return -1;

        if (column === "taskName") {
          return sortType === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }

        if (column === "category") {
          const dataA = sortVal.sortCategory.get(valA as string) || 999;
          const dataB = sortVal.sortCategory.get(valB as string) || 999;

          return sortType === "asc" ? dataA - dataB : dataB - dataA;
        }

        if (column === "priorityLvl") {
          const dataA = sortVal.sortPriority.get(valA as string) || 999;
          const dataB = sortVal.sortPriority.get(valB as string) || 999;

          return sortType === "asc" ? dataA - dataB : dataB - dataA;
        }

        if (column === "status") {
          const dataA = sortVal.sortStatus.get(valA as string) || 999;
          const dataB = sortVal.sortStatus.get(valB as string) || 999;

          return sortType === "asc" ? dataA - dataB : dataB - dataA;
        }

        if (column === "dueDate") {
          const dateA = new Date(valA).getTime();
          const dateB = new Date(valB).getTime();

          return sortType === "asc" ? dateA - dateB : dateB - dateA;
        }

        return 0;
      });

      console.log(sortedTask);

      return setTaskDataClone([...sortedTask]);
    },
    [taskData, sortVal.sortCategory, sortVal.sortPriority, sortVal.sortStatus]
  );

  const handleTaskUpdate = (updatedTask: AllTaskValueType) => {
    if (!taskDataClone) return;

    const newTasks = taskDataClone.map((task) =>
      task.taskId === updatedTask.taskId ? updatedTask : task
    );
    setTaskDataClone(newTasks);
  };

  const handleStartTask = async (taskId: string, currentStatus: string) => {
    // If task is already in progress, don't do anything
    if (currentStatus === "in progress") return;

    try {
      const res = await fetch(`/api/upd4t31npr0g/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in progress" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update local state
      const updatedTasks = taskDataClone?.map((t) =>
        t.taskId === taskId ? { ...t, status: "in progress" } : t
      );
      setTaskDataClone(updatedTasks);

      // Show success notification
      showNotification({
        message: "Task started successfully",
        type: "success",
      });
    } catch (error) {
      const err = error as Error;
      showNotification({
        message: err.message || "Failed to start task",
        type: "error",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/upd4t31npr0g/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "complete" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update local state
      const updatedTasks = taskDataClone?.map((t) =>
        t.taskId === taskId ? { ...t, status: "complete" } : t
      );
      setTaskDataClone(updatedTasks);

      showNotification({
        message: "Task completed successfully",
        type: "success",
      });
    } catch (error) {
      const err = error as Error;
      showNotification({
        message: err.message || "Failed to complete task",
        type: "error",
      });
    }
  };

  return (
    <>
      <table className="task-table text-ellipsis whitespace-nowrap">
        <thead className="task-thead">
          <tr>
            <th className="w-[2%]"></th>
            <th
              className="w-[20%] "
              onClick={() =>
                setShowFilterModal({
                  ...showFilterModal,
                  taskName: !showFilterModal.taskName,
                })
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Task Name</span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  {showFilterModal.taskName ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </div>
              {showFilterModal.taskName && (
                <>
                  {/* Overlay that covers entire screen */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setShowFilterModal({
                        ...showFilterModal,
                        taskName: false,
                      })
                    }
                  />
                  {/* Modal that stays relative to th */}
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) =>
                      e.stopPropagation()
                    }
                    className="absolute top-full left-1/2 bg-gray-50 rounded-md shadow-lg z-50 min-w-[100px] py-2"
                  >
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("asc", "taskName")}
                    >
                      Ascending
                    </span>
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("desc", "taskName")}
                    >
                      Descending
                    </span>
                  </div>
                </>
              )}
            </th>
            <th
              className="w-[13%]"
              onClick={() =>
                setShowFilterModal({
                  ...showFilterModal,
                  category: !showFilterModal.category,
                })
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Category</span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  {showFilterModal.category ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </div>
              {showFilterModal.category && (
                <>
                  {/* Overlay that covers entire screen */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setShowFilterModal({
                        ...showFilterModal,
                        category: false,
                      })
                    }
                  />
                  {/* Modal that stays relative to th */}
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) =>
                      e.stopPropagation()
                    }
                    className="absolute top-full left-1/2 bg-gray-50 rounded-md shadow-lg z-50 min-w-[100px] py-2"
                  >
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("asc", "category")}
                    >
                      Ascending
                    </span>
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("desc", "category")}
                    >
                      Descending
                    </span>
                  </div>
                </>
              )}
            </th>
            <th
              className="w-[12%]"
              onClick={() =>
                setShowFilterModal({
                  ...showFilterModal,
                  priorityLvl: !showFilterModal.priorityLvl,
                })
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Priority</span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  {showFilterModal.priorityLvl ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </div>
              {showFilterModal.priorityLvl && (
                <>
                  {/* Overlay that covers entire screen */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setShowFilterModal({
                        ...showFilterModal,
                        priorityLvl: false,
                      })
                    }
                  />
                  {/* Modal that stays relative to th */}
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) =>
                      e.stopPropagation()
                    }
                    className="absolute top-full left-1/2 bg-gray-50 rounded-md shadow-lg z-50 min-w-[100px] py-2"
                  >
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("asc", "priorityLvl")}
                    >
                      Ascending
                    </span>
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("desc", "priorityLvl")}
                    >
                      Descending
                    </span>
                  </div>
                </>
              )}
            </th>
            <th
              className="w-[14%]"
              onClick={() =>
                setShowFilterModal({
                  ...showFilterModal,
                  status: !showFilterModal.status,
                })
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Status</span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  {showFilterModal.status ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </div>
              {showFilterModal.status && (
                <>
                  {/* Overlay that covers entire screen */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setShowFilterModal({
                        ...showFilterModal,
                        status: false,
                      })
                    }
                  />
                  {/* Modal that stays relative to th */}
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) =>
                      e.stopPropagation()
                    }
                    className="absolute top-full left-1/2 bg-gray-50 rounded-md shadow-lg z-50 min-w-[100px] py-2"
                  >
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("asc", "status")}
                    >
                      Ascending
                    </span>
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("desc", "status")}
                    >
                      Descending
                    </span>
                  </div>
                </>
              )}
            </th>
            <th
              className="w-[19%]"
              onClick={() =>
                setShowFilterModal({
                  ...showFilterModal,
                  dueDate: !showFilterModal.dueDate,
                })
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Due Date</span>
                <span className="text-gray-400 group-hover:text-gray-600">
                  {showFilterModal.dueDate ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </div>
              {showFilterModal.dueDate && (
                <>
                  {/* Overlay that covers entire screen */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setShowFilterModal({
                        ...showFilterModal,
                        dueDate: false,
                      })
                    }
                  />
                  {/* Modal that stays relative to th */}
                  <div
                    onClick={(e: MouseEvent<HTMLDivElement>) =>
                      e.stopPropagation()
                    }
                    className="absolute top-full left-1/2 bg-gray-50 rounded-md shadow-lg z-50 min-w-[100px] py-2"
                  >
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("asc", "dueDate")}
                    >
                      Ascending
                    </span>
                    <span
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSortTask("desc", "dueDate")}
                    >
                      Descending
                    </span>
                  </div>
                </>
              )}
            </th>
            <th className="w-[20%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taskDataClone && taskDataClone.length > 0 ? (
            taskDataClone.map((data, index) => (
              <tr key={index}>
                <td className="text-[13px] text-center">{index + 1}</td>
                <td className="w-[19%] relative">
                  <div className="absolute inset-0 p-2 flex items-center">
                    <div className="w-full truncate">{data.taskName}</div>
                  </div>
                </td>
                <td>{data.category}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-[15px] font-medium ${
                      data.priorityLvl === "high"
                        ? "bg-red-100 text-red-800"
                        : data.priorityLvl === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {data.priorityLvl}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-[15px] font-medium ${
                      data.status === "to do"
                        ? "bg-gray-200 text-gray-800"
                        : data.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : data.status === "complete"
                        ? "bg-green-100 text-green-800"
                        : data.status === "in progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800" // for done status
                    }`}
                  >
                    {data.status}
                  </span>
                </td>
                <td>{data.dueDate && <>{formatingDate(data.dueDate, 0)}</>}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => setEditingTask(data)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  {data.status === "in progress" ? (
                    <button
                      onClick={() => handleCompleteTask(data.taskId)}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTask(data.taskId, data.status)}
                      disabled={data.status === "complete"}
                      className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        data.status === "complete"
                          ? "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
                          : "bg-blue-50 text-green-600 hover:bg-green-100 border border-blue-200"
                      }`}
                    >
                      Start
                    </button>
                  )}
                </td>
                <td>
                  {editingTask && (
                    <EditTaskForm
                      task={editingTask}
                      onClose={() => setEditingTask(null)}
                      onUpdate={handleTaskUpdate}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8">
                {" "}
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm">Create a new task to get started</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

interface EditTaskFormProps {
  task: AllTaskValueType;
  onClose: () => void;
  onUpdate: (updatedTask: AllTaskValueType) => void;
}

export function EditTaskForm({ task, onClose, onUpdate }: EditTaskFormProps) {
  const [formData, setFormData] = useState<AllTaskValueType>(task);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the data before sending
      const updateData = {
        taskName: formData.taskName,
        category: formData.category,
        priorityLvl: formData.priorityLvl,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
        status: formData.status,
      };

      console.log("Sending update data:", updateData); // Debug log

      const res = await fetch(`/api/4ddt4sk/${task.taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      console.log("Response:", data); // Debug log

      if (!res.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      showNotification({
        message: "Task updated successfully",
        type: "success",
      });

      onUpdate(formData);
      onClose();
    } catch (error) {
      const err = error as Error;
      console.error("Update error:", err); // Debug log
      showNotification({
        message: err.message || "Error updating task",
        type: "error",
      });
    } finally {
      router.refresh();
      setIsSubmitting(false);
    }
  };

  const handleCancelTask = async () => {
    try {
      const res = await fetch(`/api/upd4t31npr0g/${task.taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancel" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel task");
      }

      showNotification({
        message: "Task cancelled successfully",
        type: "success",
      });

      // Update local state with cancelled status
      const updatedTask = { ...task, status: "cancel" };
      onUpdate(updatedTask);
      onClose();
      router.refresh();
    } catch (error) {
      const err = error as Error;
      showNotification({
        message: err.message || "Error cancelling task",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 backdrop-blur-[1px] z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Task</h2>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) =>
                  setFormData({ ...formData, taskName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="home">Home</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={formData.priorityLvl}
                onChange={(e) =>
                  setFormData({ ...formData, priorityLvl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: new Date(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancelTask}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors cursor-pointer"
              >
                Cancel Task
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
