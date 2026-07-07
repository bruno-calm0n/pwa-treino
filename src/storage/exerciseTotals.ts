import { INITIAL_TOTALS } from "../exercises";
import type { ExerciseKey, ExerciseTotals } from "../types";

const STORAGE_KEY = "treino-diario-contadores";

export const createInitialTotals = (): ExerciseTotals => ({ ...INITIAL_TOTALS });

const isValidCounter = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isExerciseTotals = (value: unknown): value is ExerciseTotals => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const totals = value as Partial<Record<ExerciseKey, unknown>>;

  return (
    isValidCounter(totals.flexoes) &&
    isValidCounter(totals.polichinelos) &&
    isValidCounter(totals.abdominais)
  );
};

export const persistTotals = (totals: ExerciseTotals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(totals));
  } catch (error) {
    console.error("Não foi possível salvar os dados do treino:", error);
  }
};

export const loadStoredTotals = (): ExerciseTotals => {
  try {
    const storedTotals = localStorage.getItem(STORAGE_KEY);

    if (!storedTotals) {
      return createInitialTotals();
    }

    const parsedTotals: unknown = JSON.parse(storedTotals);

    if (isExerciseTotals(parsedTotals)) {
      return parsedTotals;
    }
  } catch (error) {
    console.error("Não foi possível carregar os dados do treino:", error);
  }

  return createInitialTotals();
};
