import LoginScreen from "./components/LoginScreen";
import WorkoutScreen from "./components/WorkoutScreen";
import { useExerciseTotalsSync } from "./hooks/useExerciseTotalsSync";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { useThemePreference } from "./hooks/useThemePreference";
import { isSupabaseConfigured } from "./lib/supabase";

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

  const { theme, toggleTheme } = useThemePreference();

  const {
    addExercise,
    isSyncLoading,
    removeExercise,
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
        onToggleTheme={toggleTheme}
        theme={theme}
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
      onToggleTheme={toggleTheme}
      syncError={syncError}
      syncLabel={syncLabel}
      theme={theme}
      totals={totals}
    />
  );
}

export default App;
