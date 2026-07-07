import { EXERCISES } from "../exercises";
import type { ExerciseKey, ExerciseTotals } from "../types";
import AppHeader from "./AppHeader";

type WorkoutScreenProps = {
  accountEmail?: string;
  isSyncLoading: boolean;
  onAddExercise: (exercise: ExerciseKey, increment: number) => void;
  onLogout: () => void;
  onResetDay: () => void;
  syncError: string;
  syncLabel: string;
  totals: ExerciseTotals;
};

function WorkoutScreen({
  isSyncLoading,
  onAddExercise,
  onResetDay,
  syncError,
  totals,
}: WorkoutScreenProps) {
  return (
    <main className="app-shell">
      <AppHeader
        title="Registre seus exercícios"
        subtitle="Os totais ficam salvos no dispositivo e continuam disponíveis mesmo ao fechar o app."
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

      <section className="actions" aria-label="Ações de treino">
        {EXERCISES.map((exercise) => (
          <button
            className="action-button"
            key={exercise.key}
            type="button"
            disabled={isSyncLoading}
            onClick={() => onAddExercise(exercise.key, exercise.increment)}
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

      <button
        className="reset-button"
        type="button"
        disabled={isSyncLoading}
        onClick={onResetDay}
      >
        Resetar dia
      </button>
    </main>
  );
}

export default WorkoutScreen;
