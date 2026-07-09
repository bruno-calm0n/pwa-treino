import LoginScreen from "./components/LoginScreen";
import WorkoutScreen from "./components/WorkoutScreen";
import { useExerciseTotalsSync } from "./hooks/useExerciseTotalsSync";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { isSupabaseConfigured } from "./lib/supabase";

//trigger deploy teste parte 2s

const SUPABASE_CONFIG_ERROR =
  "Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local.";

function App() {
  const {
    authEmail,
    authError,
    authLoading,
    authPassword,
    isSubmittingLogin,
    login,
    logout,
    session,
    setAuthEmail,
    setAuthPassword,
  } = useSupabaseAuth(SUPABASE_CONFIG_ERROR);

  const {
    addExercise,
    isSyncLoading,
    removeExercise,
    resetDay,
    syncError,
    syncLabel,
    totals,
  } = useExerciseTotalsSync(session);

  if (authLoading || !session) {
    return (
      <LoginScreen
        authEmail={authEmail}
        authError={authError}
        authPassword={authPassword}
        configError={SUPABASE_CONFIG_ERROR}
        isLoading={authLoading}
        isSubmittingLogin={isSubmittingLogin}
        isSupabaseConfigured={isSupabaseConfigured}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onSubmit={login}
      />
    );
  }

  return (
    <WorkoutScreen
      accountEmail={session.user.email}
      isSyncLoading={isSyncLoading}
      onAddExercise={addExercise}
      onLogout={logout}
      onRemoveExercise={removeExercise}
      onResetDay={resetDay}
      syncError={syncError}
      syncLabel={syncLabel}
      totals={totals}
    />
  );
}

export default App;
