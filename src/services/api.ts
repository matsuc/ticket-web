const BASE = "";

export type StartTaskInput = {
  user_id: string;
  target_date: string; // YYYY-MM-DDTHH:MM:SS
  duration: number; // minutes or your backend contract
};

export type LoginInput = { username: string; password: string };
type LoginResponse = { user_id: string };


function withCreds(init: RequestInit = {}): RequestInit {
  const headers: HeadersInit = init.headers ?? {};
  return {
    credentials: "include",          // 讓 cookie 一定會帶上
    ...init,
    headers,
  };
}


export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err as object);
  } catch {
    return String(err);
  }
}

export async function apiLogin(body: LoginInput): Promise<{ success: true; user_id: string }> {
  const res = await fetch(`${BASE}/auth/login`, withCreds({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  if (!res.ok) throw new Error("Login failed. Please check your credentials.");
  const data: LoginResponse = await res.json();
  return { success: true, user_id: data.user_id };
}

export async function apiLogout() {
  await fetch(`${BASE}/auth/logout`, withCreds({ method: "POST" }));
}

export async function apiStartTask(
  body: StartTaskInput
): Promise<{ task_id: string }> {
  const res = await fetch(`${BASE}/start_task`,  withCreds({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  if (!res.ok) throw new Error(`start_task failed: ${res.status}`);
  return res.json();
}

export async function apiTaskStatus(
  task_id: string
): Promise<{ status: string; result?: string }> {
  const res = await fetch(`${BASE}/task_status/${encodeURIComponent(task_id)}`, withCreds());
  if (!res.ok) throw new Error(`task_status failed: ${res.status}`);
  return res.json();
}

export async function apiDeleteTask(task_id: string): Promise<void> {
  const res = await fetch(`${BASE}/delete_task/${encodeURIComponent(task_id)}`, withCreds({ method: "DELETE" }));
  if (!res.ok) throw new Error(`delete failed: ${res.status}`);
}

export async function apiAllProgressTasks(): Promise<
  { progress_tasks: Array<{ id: string }>; pending_tasks: Array<{ id: string }> }
> {
  const res = await fetch(`${BASE}/all_progress_tasks`);
  if (!res.ok) throw new Error(`all_progress_tasks failed: ${res.status}`);
  const data = await res.json();
  return { progress_tasks: data.progress_tasks, pending_tasks: data.pending_tasks };
}

export async function apiAvailableCourts(
  body: StartTaskInput
): Promise<{ available_courts: string[] }> {
  const res = await fetch(`${BASE}/available_courts`, withCreds({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  // console.log("apiAvailableCourts", await res.json());
  if (!res.ok) throw new Error(`available_courts failed: ${res.status}`);
  return res.json();
}
