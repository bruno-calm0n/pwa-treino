import { EXERCISES } from "../exercises";
import type { AppTheme, ExerciseKey, ExerciseTotals } from "../types";
import AppHeader from "./AppHeader";

type WorkoutScreenProps = {
  accountEmail?: string;
  isSyncLoading: boolean;
  onAddExercise: (exercise: ExerciseKey, increment: number) => void;
  onLogout: () => void;
  onRemoveExercise: (exercise: ExerciseKey, increment: number) => void;
  onToggleTheme: () => void;
  syncError: string;
  syncLabel: string;
  theme: AppTheme;
  totals: ExerciseTotals;
};

function WorkoutScreen({
  isSyncLoading,
  onAddExercise,
  onRemoveExercise,
  onToggleTheme,
  syncError,
  theme,
  totals,
}: WorkoutScreenProps) {
  return (
    <main className="app-shell">
      <AppHeader
        onToggleTheme={onToggleTheme}
        theme={theme}
        title="Organize seu treino de hoje."
      />

      {/* <section className="account-bar" aria-label="Conta conectada">
        <div>
          <span>Logado como</span>
          <strong>{accountEmail}</strong>
        </div>
        <div className="sync-info">
          <span>{syncLabel}</span>
          <button type="button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </section> */}

      {syncError && (
        <p className="sync-error" role="alert">
          {syncError}
        </p>
      )}

      <section className="workout-section" aria-label="Ações de treino">
        <div className="actions">
          {EXERCISES.map((exercise) => (
            <article className="exercise-action" key={exercise.key}>
              <span className="exercise-name-button">
                {exercise.totalLabel}
              </span>
              <div className="exercise-action-buttons">
                <button
                  className="icon-action-button"
                  type="button"
                  aria-label={`Adicionar ${exercise.totalLabel}`}
                  disabled={isSyncLoading}
                  onClick={() =>
                    onAddExercise(exercise.key, exercise.increment)
                  }
                >
                  +
                </button>
                <button
                  className="icon-action-button"
                  type="button"
                  aria-label={`Remover ${exercise.totalLabel}`}
                  disabled={isSyncLoading || totals[exercise.key] === 0}
                  onClick={() =>
                    onRemoveExercise(exercise.key, exercise.increment)
                  }
                >
                  -
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workout-section" aria-label="Contadores">
        <div className="totals">
          {EXERCISES.map((exercise) => (
            <article className="total-card" key={exercise.key}>
              <span>{exercise.totalLabel}</span>
              <strong>{totals[exercise.key]}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default WorkoutScreen;
