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
    id: string;
    status: string;
    target_date: string; // YYYY-MM-DDTHH:MM:SS
    duration: number;
};

export type Credentials = { user_id: string };
