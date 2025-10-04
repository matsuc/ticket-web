import type { Task } from "../types/task";
import type { Credentials } from "../types/task";

const STORAGE_KEY = "task-manager-demo:v1";
const CREDS_KEY = "task-manager-demo:creds";

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


export function saveCreds(creds: Credentials) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}


export function loadCreds(): Credentials | null {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Credentials;
    if (obj && typeof obj.username === "string" && typeof obj.password === "string") return obj;
    return null;
  } catch { return null; }
}


export function clearCreds() { localStorage.removeItem(CREDS_KEY); }
