import type { ExerciseConfig, ExerciseTotals } from "./types";

export const INITIAL_TOTALS: ExerciseTotals = {
  flexoes: 0,
  polichinelos: 0,
  abdominais: 0,
};

export const EXERCISES: ExerciseConfig[] = [
  {
    key: "flexoes",
    actionLabel: "Add Flexão",
    totalLabel: "Flexões",
    increment: 5,
  },
  {
    key: "polichinelos",
    actionLabel: "Add Polichinelo",
    totalLabel: "Polichinelos",
    increment: 20,
  },
  {
    key: "abdominais",
    actionLabel: "Add Abdominal",
    totalLabel: "Abdominais",
    increment: 5,
  },
];
