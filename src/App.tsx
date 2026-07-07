import { useEffect, useLayoutEffect, useState } from "react";

type ExerciseKey = "flexoes" | "polichinelos" | "abdominais";

type ExerciseTotals = Record<ExerciseKey, number>;

type Theme = "light" | "dark";

type ExerciseConfig = {
  key: ExerciseKey;
  actionLabel: string;
  totalLabel: string;
  increment: number;
};

const STORAGE_KEY = "treino-diario-contadores";
const THEME_STORAGE_KEY = "treino-diario-tema";
const THEME_COLORS: Record<Theme, string> = {
  light: "#2563eb",
  dark: "#101827",
};

const INITIAL_TOTALS: ExerciseTotals = {
  flexoes: 0,
  polichinelos: 0,
  abdominais: 0,
};

const EXERCISES: ExerciseConfig[] = [
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

const createInitialTotals = (): ExerciseTotals => ({ ...INITIAL_TOTALS });

const isValidCounter = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

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

const persistTotals = (totals: ExerciseTotals) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(totals));
  } catch (error) {
    console.error("Não foi possível salvar os dados do treino:", error);
  }
};

const loadStoredTotals = (): ExerciseTotals => {
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

const loadStoredTheme = (): Theme => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (isTheme(storedTheme)) {
      return storedTheme;
    }
  } catch (error) {
    console.error("Não foi possível carregar o tema:", error);
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

function App() {
  const [totals, setTotals] = useState<ExerciseTotals>(loadStoredTotals);
  const [theme, setTheme] = useState<Theme>(loadStoredTheme);

  useEffect(() => {
    persistTotals(totals);
  }, [totals]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Não foi possível salvar o tema:", error);
    }
  }, [theme]);

  const addExercise = (exercise: ExerciseKey, increment: number) => {
    setTotals((currentTotals) => {
      return {
        ...currentTotals,
        [exercise]: currentTotals[exercise] + increment,
      };
    });
  };

  const resetDay = () => {
    const shouldReset = window.confirm(
      "Tem certeza que deseja zerar os contadores do dia?",
    );

    if (!shouldReset) {
      return;
    }

    setTotals(createInitialTotals());
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const isDarkTheme = theme === "dark";

  return (
    <main className="app-shell">
      <div className="top-bar">
        <section className="hero" aria-labelledby="app-title">
          <p className="eyebrow">Treino diário</p>
          <h1 id="app-title">Registre seus exercícios</h1>
          <p className="subtitle">
            Os totais ficam salvos no dispositivo e continuam disponíveis mesmo
            ao fechar o app.
          </p>
        </section>

        <button
          aria-pressed={isDarkTheme}
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
        >
          {isDarkTheme ? "Tema claro" : "Tema escuro"}
        </button>
      </div>

      <section className="actions" aria-label="Ações de treino">
        {EXERCISES.map((exercise) => (
          <button
            className="action-button"
            key={exercise.key}
            type="button"
            onClick={() => addExercise(exercise.key, exercise.increment)}
          >
            {exercise.actionLabel}
            <span>+{exercise.increment}</span>
          </button>
        ))}
      </section>

      <section className="totals" aria-label="Totais acumulados">
        {EXERCISES.map((exercise) => (
          <article className="total-card" key={exercise.key}>
            <span>{exercise.totalLabel}</span>
            <strong>{totals[exercise.key]}</strong>
          </article>
        ))}
      </section>

      <button className="reset-button" type="button" onClick={resetDay}>
        Resetar dia
      </button>
    </main>
  );
}

export default App;
