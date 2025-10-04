export type TaskStatus = "pending" | "in-progress" | "paused" | "done" | string;


export type Task = {
    id: string;
    status: TaskStatus;
    target_date: string; // YYYY-MM-DDTHH:MM:SS
    duration: number;
    result?: string;
    createdAt: number;
    updatedAt: number;
};

export type ServerTask = {
    task_id: string;
    status: string;
    progress?: number;
    title?: string;
    description?: string;
    result?: unknown;
};
