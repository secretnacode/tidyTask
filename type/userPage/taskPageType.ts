export type AddTaskValueType = {
  taskName: string;
  taskDescription: string;
  category: string;
  priority: string;
  dueDate: Date | undefined;
};

export type InsertTaskValueType = {
  taskName: string;
  taskDescription: string;
  category: string;
  priority: string;
  dueDate: Date | undefined;
  taskId: string;
  userId: string;
  status: string;
  dateCreated: Date;
};

export type AllTaskValueType = {
  taskId: string;
  taskName: string;
  taskDesc: string;
  priorityLvl: string;
  status: string;
  category: string;
  dueDate: Date | undefined;
  [key: string]: string | Date | undefined;
};

export type SortValType = "asc" | "desc";

export type ColumnValType =
  | "taskName"
  | "category"
  | "priorityLvl"
  | "status"
  | "dueDate";

export type FilterModalVisibility = {
  taskName: boolean;
  category: boolean;
  priorityLvl: boolean;
  status: boolean;
  dueDate: boolean;
};

export type ActiveFilterType = "category" | "priorityLvl" | "status" | null;

export type FilterValueType = string | null;
