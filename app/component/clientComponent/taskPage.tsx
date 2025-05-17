"use client";

import { AddTaskValueType, AllTaskValueType } from "@/type";
import { CirclePlus, Funnel, Search, X } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNotification } from "./providers/notificationProvider";
import { ValidateAddTaskValue } from "@/util/functions/validateFrontFunction";
import { useParams } from "next/navigation";
import {
  filterDateByOverdueTask,
  filterDueTodayTask,
} from "@/util/functions/helperFunciton";
import { EditTaskForm, TaskTable } from "./taskTable";

export function TasksFormTable() {
  const params = useParams();
  const userId = params.userId;
  const { showNotification } = useNotification();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tobeFilter, setTobeFilter] = useState<{
    column: string;
    value: string;
  }>({
    column: "",
    value: "",
  });
  const [filterModal, setFilterModal] = useState({
    category: false,
    priorityLvl: false,
    status: false,
  });
  const [taskVal, setTaskVal] = useState<AllTaskValueType[]>([
    {
      taskId: "",
      taskName: "",
      taskDesc: "",
      priorityLvl: "low", // Or your preferred default
      status: "to do", // Or your preferred default
      category: "",
      dueDate: undefined,
    },
  ]);
  const [taskValCopy, setTaskValCopy] = useState<AllTaskValueType[]>([
    {
      taskId: "",
      taskName: "",
      taskDesc: "",
      priorityLvl: "", // Or your preferred default
      status: "", // Or your preferred default
      category: "",
      dueDate: undefined,
    },
  ]);

  const handleTobeFilter = useCallback((column: string, value: string) => {
    setTobeFilter({ column: column, value: value });
  }, []);

  // will be called if there's a overdue task to update the status of the task
  const updateOverdueTasks = useCallback(
    async (dueYesterday: AllTaskValueType[]) => {
      try {
        await Promise.all(
          dueYesterday.map(async (val) => {
            const res = await fetch(`/api/0v3rdu3/${val.taskId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "overdue" }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message);
            }
          })
        );
      } catch (error) {
        const err = error as Error;
        console.log(err.message);
        showNotification({
          message: "Error occurred while fetching user Tasks",
          type: "error",
        });
      }
    },
    [showNotification]
  );

  const fetchTask = useCallback(async () => {
    try {
      const res = await fetch(`/api/4ddt4sk/${userId}`, {
        method: "GET",
      });

      const data = await res.json();

      // check if the response is ok, if not, throw an error
      if (!res.ok) throw new Error(data.message);

      // will filter the task date and update the value in the database if that data is already over due
      const dueYesterday = filterDateByOverdueTask(data.data);

      // if theres a due dueYesterday, will make an update statement, will make the status into ovedue
      if (dueYesterday.length > 0) {
        await updateOverdueTasks(dueYesterday);
        return await fetchTask();
      }

      setTaskVal(data.data);
      setTaskValCopy(data.data);

      return;
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      showNotification({
        message: "Error occurred while fetching user Tasks",
        type: "error",
      });
    }
  }, [showNotification, userId, updateOverdueTasks]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Add the filter options
  const filterOptions = {
    category: ["work", "personal", "home", "study", "other"],
    priority: ["high", "medium", "low"],
    status: ["in progress", "to do", "overdue"],
  };

  return (
    <div className="p-10 pr-5 pt-0 flex gap-8 w-full">
      {/* for showing the add task form  */}
      {showAddTaskForm && (
        <AddTaskForm
          handleFormView={(val: boolean) => setShowAddTaskForm(val)}
          userId={userId as string}
          fetchTask={fetchTask}
        />
      )}
      <div className="bg-white shadow-sm rounded-2xl p-4 w-2/3 h-fit">
        <div className="flex justify-between items-center ">
          <p className="text-lg font-black">All Task</p>
          <div>
            <div className="relative">
              <input
                type="text"
                name="searchTask"
                placeholder="House Cleaning"
                className="pr-3 pl-8 py-2 text-sm border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute top-0 left-0 p-2">
                <Search />
              </div>
            </div>
          </div>
        </div>
        <div className=" mt-5 border-2 p-4 rounded-md">
          <div className="flex justify-between items-center">
            {/* filter the tasks  */}
            <div className="flex justify-center items-center gap-3 relative">
              {/* Category Filter */}
              <div
                className="relative"
                onClick={() =>
                  setFilterModal((prev) => ({
                    ...prev,
                    category: !prev.category,
                  }))
                }
              >
                <div className="flex justify-center items-center gap-1 p-2 go-button rounded-[3px] !px-3 !py-1 !bg-white !text-black !border-gray-600 !border-2 hover:bg-gray-50">
                  <span>
                    <Funnel className="size-4" />
                  </span>
                  <p className="text-sm text-gray-600 font-semibold">
                    Category
                  </p>
                </div>
                {filterModal.category && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() =>
                        setFilterModal((prev) => ({
                          ...prev,
                          category: !prev.category,
                        }))
                      }
                    />
                    <div className="absolute top-full left-0 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                      {filterOptions.category.map((option) => (
                        <button
                          key={option}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700 capitalize"
                          onClick={() => handleTobeFilter("category", option)}
                        >
                          {option}
                        </button>
                      ))}
                      <div className="flex justify-center items-center gap-3 relative">
                        {/* ...existing filter buttons... */}

                        {(tobeFilter.column || tobeFilter.value) && (
                          <button
                            onClick={() => {
                              setTobeFilter({ column: "", value: "" });
                            }}
                            className="flex items-center gap-1 p-2 rounded-[3px] !px-3 !py-1 bg-gray-100 text-gray-600 mb-2 hover:bg-gray-200"
                          >
                            <X className="size-4" />
                            <span className="text-sm">Reset</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Priority Filter */}
              <div
                className="relative"
                onClick={() =>
                  setFilterModal((prev) => ({
                    ...prev,
                    priorityLvl: !prev.priorityLvl,
                  }))
                }
              >
                <div className="flex justify-center items-center gap-1 p-2 go-button rounded-[3px] !px-3 !py-1 !bg-white !text-black !border-gray-600 !border-2 hover:bg-gray-50">
                  <span>
                    <Funnel className="size-4" />
                  </span>
                  <p className="text-sm text-gray-600 font-semibold">
                    Priority
                  </p>
                </div>
                {filterModal.priorityLvl && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() =>
                        setFilterModal((prev) => ({
                          ...prev,
                          priorityLvl: !prev.priorityLvl,
                        }))
                      }
                    />
                    <div className="absolute top-full left-0 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                      {filterOptions.priority.map((option) => (
                        <button
                          key={option}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700 capitalize"
                          onClick={() =>
                            handleTobeFilter("priorityLvl", option)
                          }
                        >
                          {option}
                        </button>
                      ))}
                      <div className="flex justify-center items-center gap-3 relative">
                        {/* ...existing filter buttons... */}

                        {(tobeFilter.column || tobeFilter.value) && (
                          <button
                            onClick={() => {
                              setTobeFilter({ column: "", value: "" });
                            }}
                            className="flex items-center gap-1 p-2 rounded-[3px] !px-3 !py-1 bg-gray-100 text-gray-600 mb-2 hover:bg-gray-200"
                          >
                            <X className="size-4" />
                            <span className="text-sm">Reset</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Status Filter */}
              <div
                className="relative"
                onClick={() =>
                  setFilterModal((prev) => ({ ...prev, status: !prev.status }))
                }
              >
                <div className="flex justify-center items-center gap-1 p-2 go-button rounded-[3px] !px-3 !py-1 !bg-white !text-black !border-gray-600 !border-2 hover:bg-gray-50">
                  <span>
                    <Funnel className="size-4" />
                  </span>
                  <p className="text-sm text-gray-600 font-semibold">Status</p>
                </div>
                {filterModal.status && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() =>
                        setFilterModal((prev) => ({
                          ...prev,
                          status: !prev.status,
                        }))
                      }
                    />
                    <div className="absolute top-full left-0 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                      {filterOptions.status.map((option) => (
                        <button
                          key={option}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700 capitalize"
                          onClick={() => handleTobeFilter("status", option)}
                        >
                          {option}
                        </button>
                      ))}
                      <div className="flex justify-center items-center gap-3 relative">
                        {/* ...existing filter buttons... */}

                        {(tobeFilter.column || tobeFilter.value) && (
                          <button
                            onClick={() => {
                              setTobeFilter({ column: "", value: "" });
                            }}
                            className="flex items-center gap-1 p-2 rounded-[3px] !px-3 !py-1 bg-gray-100 text-gray-600 mb-2 hover:bg-gray-200"
                          >
                            <X className="size-4" />
                            <span className="text-sm">Reset</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowAddTaskForm(true)}
              className="flex justify-center items-center gap-3 cursor-pointer go-button rounded-[3px] !px-3"
            >
              <span>
                <CirclePlus />
              </span>
              Add Task
            </button>
          </div>
          <TaskTable taskVal={taskValCopy} tobeFilter={tobeFilter} />
        </div>
      </div>
      <DueTodayTask task={taskVal} />
    </div>
  );
}

function AddTaskForm({
  handleFormView,
  userId,
  fetchTask,
}: {
  handleFormView: (val: boolean) => void;
  userId: string;
  fetchTask: () => void;
}) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taskVal, setTaskVal] = useState<AddTaskValueType>({
    taskName: "",
    taskDescription: "",
    category: "",
    priority: "",
    dueDate: undefined,
  });

  // for removing the form view
  const handleRemoveForm = useCallback(() => {
    handleFormView(false);
  }, [handleFormView]);

  // for minimum date
  const today = new Date();
  const minDate = `${String(today.getFullYear())}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // for adding the value in taskVal object by inputing a value in the form
  const handTaskval = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setTaskVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  // for inserting the value of tasks in the database
  const handleAddTask = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // validate if all the field has a value
      const validation = ValidateAddTaskValue<AddTaskValueType>(taskVal);

      if (!validation.validate)
        return showNotification({
          message: `${validation.message}`,
          type: "warning",
        });

      try {
        setIsSubmitting(true);
        const res = await fetch(`/api/4ddt4sk`, {
          method: "POST",
          body: JSON.stringify({ ...taskVal, userId: userId }),
        });

        const data = await res.json();

        // check if the response is ok, if not, throw an error
        if (!res.ok) throw new Error(data.message);

        // will call the setNotification function from the notification provider
        showNotification({
          message: data.message,
          type: "success",
        });
      } catch (error) {
        const err = error as Error;
        console.log(err.message);

        // will call the setNotification function from the notification provider
        // to give an error message to the provider
        showNotification({ message: err.message, type: "error" });
      } finally {
        // whether the task is added or not, the form will be removed
        fetchTask();
        handleRemoveForm();
      }
    },
    [taskVal, handleRemoveForm, showNotification, userId, fetchTask]
  );

  return (
    <div
      className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-20 bg-[rgba(0,_0,_0,_0.4)]"
      onClick={() => handleRemoveForm()}
    >
      <div
        className="z-50 bg-white px-10 py-7 rounded-3xl"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Add Task</h1>
            <span className="text-sm text-gray-500">Create new Task</span>
          </div>
          <button
            type="button"
            className="text-gray-400 rounded-full p-1 hover:scale-110 focus:text-gray-500"
            onClick={() => handleRemoveForm()}
          >
            <X className="size-6" />
            {/* Assuming your X component accepts a className prop */}
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <form onSubmit={handleAddTask} className="">
          <div>
            <label>Task Name:</label>
            <input
              type="text"
              name="taskName"
              onChange={handTaskval}
              value={taskVal.taskName}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="mt-4">
            <label>Task Description:</label>
            <textarea
              name="taskDescription"
              onChange={handTaskval}
              value={taskVal.taskDescription}
              rows={3}
              className="border rounded-md px-3 py-2 w-full h-full resize-none"
            />
          </div>

          <div className="mt-3">
            <label>Category:</label>
            <select
              name="category"
              onChange={handTaskval}
              value={taskVal.category}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select Category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="study">Study</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mt-4">
            <label>Priority Level:</label>
            <select
              id="priority"
              name="priority"
              onChange={handTaskval}
              value={taskVal.priority}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mt-4">
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              onChange={handTaskval}
              value={
                taskVal.dueDate
                  ? new Date(taskVal.dueDate).toISOString().split("T")[0]
                  : ""
              }
              className="border rounded-md px-3 py-2 w-full"
              min={minDate}
            />
          </div>

          <div className="mt-6 flex justify-end items-center gap-5 ">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleRemoveForm()}
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isSubmitting ? "Adding Task..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DueTodayTask({ task }: { task: AllTaskValueType[] }) {
  const [taskDataClone, setTaskDataClone] = useState<AllTaskValueType[]>();
  const [editingTask, setEditingTask] = useState<AllTaskValueType | null>(null);
  const { showNotification } = useNotification();

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
      const updatedTasks = task.map((t) =>
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

  const dueToday = filterDueTodayTask(task);
  return (
    <div className=" w-1/3 bg-white shadow-sm rounded-2xl p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-black">Due today</h1>
        <span className="text-[15px] text-gray-500 cursor-pointer">
          See all
        </span>
      </div>
      <table className="dueToday-task w-full">
        <thead>
          <tr>
            <th className="text-left w-[30%]">Task Name</th>
            <th className="text-left w-[20%]">Priority</th>
            <th className="text-left w-[20%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {dueToday && dueToday.length > 0 ? (
            dueToday.map((val, index) => (
              <tr key={index}>
                <td className=" relative">
                  <div className="absolute inset-0 p-2 flex items-center">
                    <div className="w-full truncate">{val.taskName}</div>
                  </div>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-[15px] font-medium ${
                      val.priorityLvl === "high"
                        ? "bg-red-100 text-red-800"
                        : val.priorityLvl === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {val.priorityLvl}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => setEditingTask(val)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-md transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  {val.status === "in progress" ? (
                    <button
                      onClick={() => handleCompleteTask(val.taskId)}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTask(val.taskId, val.status)}
                      disabled={val.status === "complete"}
                      className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        val.status === "complete"
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
              <td colSpan={3} className="text-center py-8">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-medium">No tasks due today</p>
                  <p className="text-xs">All caught up!</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
