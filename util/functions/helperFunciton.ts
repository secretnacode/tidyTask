import { v4 as uuidv4 } from "uuid";

// creating a unique id
export function CreateId<T>(): T {
  return uuidv4() as T;
}
