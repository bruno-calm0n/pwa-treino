import type { ExerciseConfig, ExerciseTotals } from "./types";

export const INITIAL_TOTALS: ExerciseTotals = {
  flexoes: 0,
  polichinelos: 0,
  abdominais: 0,
};

export const EXERCISES: ExerciseConfig[] = [
  {
    key: "flexoes",
    totalLabel: "Flexões",
    increment: 5,
  },
  {
    key: "polichinelos",
    totalLabel: "Polichinelos",
    increment: 20,
  },
  {
    key: "abdominais",
    totalLabel: "Abdominais",
    increment: 5,
  },
];
