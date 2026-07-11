export type ExerciseKey = "flexoes" | "polichinelos" | "abdominais";

export type ExerciseTotals = Record<ExerciseKey, number>;

export type SyncStatus = "idle" | "loading" | "saving" | "saved" | "error";

export type AppTheme = "light" | "dark";

export type ExerciseConfig = {
  key: ExerciseKey;
  totalLabel: string;
  increment: number;
};
