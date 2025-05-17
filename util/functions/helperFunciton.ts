import { AllTaskValueType } from "@/type";
import { v4 as uuidv4 } from "uuid";

// creating a unique id
export function CreateId<T>(): T {
  return uuidv4() as T;
}

export function filterDateByOverdueTask(
  data: AllTaskValueType[]
): AllTaskValueType[] {
  const dateToday = new Date();

  return data.filter((val) => {
    if (!val.dueDate) return false;

    if (val.taskName === "task4") {
      console.log(`compared date: ${dateToday}`);
      console.log(`due date: ${val.dueDate}`);
    }

    const taskDate = new Date(val.dueDate);

    // will return the object if its already passed the given time
    return (
      taskDate <= dateToday &&
      (val.status === "to do" || val.status === "in progress")
    );
  });
}

export function filterDueTodayTask(
  data: AllTaskValueType[]
): AllTaskValueType[] {
  const dateToday = new Date();

  // will filter the task object and will return on the objects that the duedate is equals to today's date
  const newData = data.filter((val) => {
    if (!val.dueDate) return false;

    const taskDate = new Date(val.dueDate);
    const taskDatePH = new Date(
      taskDate.toLocaleString("en-PH", { timeZone: "UTC" })
    );

    // will return the object if its already passed the given time
    return (
      taskDatePH.getFullYear() === dateToday.getFullYear() &&
      taskDatePH.getMonth() === dateToday.getMonth() &&
      taskDatePH.getDate() === dateToday.getDate() &&
      (val.status === "to do" || val.status === "in progress")
    );
  });

  return newData;
}

export function formatingDate(data: Date, index: number): string {
  const date = new Date(data);

  if (index === 0) {
    return date.toLocaleString("en-PH", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } else if (index === 1) {
    return date.toLocaleString("en-PH", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return "you enter a wrong index";
}
