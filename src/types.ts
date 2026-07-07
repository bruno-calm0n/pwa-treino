export type ExerciseKey = "flexoes" | "polichinelos" | "abdominais";

export type ExerciseTotals = Record<ExerciseKey, number>;

export type SyncStatus = "idle" | "loading" | "saving" | "saved" | "error";

export type ExerciseConfig = {
  key: ExerciseKey;
  actionLabel: string;
  totalLabel: string;
  increment: number;
};
