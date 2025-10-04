import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { loadTasks, saveTasks } from "../utils/storage";

export function useLocalTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  useEffect(() => { saveTasks(tasks); }, [tasks]);
  return { tasks, setTasks } as const;
}
