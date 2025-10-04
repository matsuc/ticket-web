export type TaskStatus = "pending" | "in-progress" | "paused" | "done" | string;


export type Task = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    progress: number; // 0..100
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
