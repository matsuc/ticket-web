import type { Task } from "../types/task";

const STORAGE_KEY = "task-manager-demo:v1";

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Task[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
