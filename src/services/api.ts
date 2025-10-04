const BASE = "http://34.87.17.2:5566";

export type StartTaskInput = {
  username: string;
  password: string;
  target_date: string; // YYYY-MM-DDTHH:MM:SS
  duration: number; // minutes or your backend contract
};

export type LoginInput = {
  username: string;
  password: string;
};


export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err as object);
  } catch {
    return String(err);
  }
}

export async function apiLogin(body: LoginInput): Promise<{ success: boolean } & Record<string, unknown>> {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Login failed. Please check your credentials.`);
  let data: unknown = null;
  try { data = await res.json(); } catch { /* empty body */ }
  return { success: true, ...(typeof data === "object" && data ? (data as Record<string, unknown>) : {}) };
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
): Promise<{ status: string; result?: string }> {
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
  const data = await res.json();
  return data.progress_tasks;
}

export async function apiAvailableCourts(
  body: StartTaskInput
): Promise<{ available_courts: string[] }> {
  const res = await fetch(`${BASE}/available_courts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // console.log("apiAvailableCourts", await res.json());
  if (!res.ok) throw new Error(`available_courts failed: ${res.status}`);
  return res.json();
}
