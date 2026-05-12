export type TaskStatus = "Todo" | "In Progress" | "Done";
export type Task = {
    id: string;
    title: string;
    status: TaskStatus;
};
export type TaskFilter = "All" | "Todo" | "In Progress" | "Done"