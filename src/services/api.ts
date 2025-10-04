const BASE = "http://34.87.17.2:5566";

export type StartTaskInput = {
  username: string;
  password: string;
  target_date: string; // YYYY-MM-DDTHH:MM:SS
  duration: number; // minutes or your backend contract
};


export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err as object);
  } catch {
    return String(err);
  }
}

export async function apiStartTask(
  body: StartTaskInput
): Promise<{ task_id: string }> {
  const res = await fetch(`${BASE}/start_task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`start_task failed: ${res.status}`);
  return res.json();
}

export async function apiTaskStatus(
  task_id: string
): Promise<{ status: string; result?: unknown }> {
  const res = await fetch(`${BASE}/task_status/${encodeURIComponent(task_id)}`);
  if (!res.ok) throw new Error(`task_status failed: ${res.status}`);
  return res.json();
}

export async function apiDeleteTask(task_id: string): Promise<void> {
  const res = await fetch(
    `${BASE}/task_status/${encodeURIComponent(task_id)}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(`delete failed: ${res.status}`);
}

export async function apiAllProgressTasks(): Promise<
  Array<{
    task_id: string;
    status: string;
    progress?: number;
  }>
> {
  const res = await fetch(`${BASE}/all_progress_tasks`);
  if (!res.ok) throw new Error(`all_progress_tasks failed: ${res.status}`);
  return res.json();
}

export async function apiAvailableCourts(
  body: StartTaskInput
): Promise<{ courts: string[] }> {
  const res = await fetch(`${BASE}/available_courts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`available_courts failed: ${res.status}`);
  return res.json();
}
