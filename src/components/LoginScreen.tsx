import type { FormEvent } from "react";
import type { AppTheme } from "../types";
import AppHeader from "./AppHeader";

type LoginScreenProps = {
  authError: string;
  authEmail: string;
  authPassword: string;
  configError: string;
  isLoading: boolean;
  isSubmittingLogin: boolean;
  isSupabaseConfigured: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleTheme: () => void;
  theme: AppTheme;
};

function LoginScreen({
  authError,
  authEmail,
  authPassword,
  configError,
  isLoading,
  isSubmittingLogin,
  isSupabaseConfigured,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleTheme,
  theme,
}: LoginScreenProps) {
  if (isLoading) {
    return (
      <main className="app-shell login-shell">
        <AppHeader
          onToggleTheme={onToggleTheme}
          theme={theme}
          title="Entrar no app"
          subtitle="Carregando sessão..."
        />
      </main>
    );
  }

  return (
    <main className="app-shell login-shell">
      <AppHeader
        onToggleTheme={onToggleTheme}
        theme={theme}
        title="Entrar no app"
        subtitle="Use o email e a senha criados manualmente no Supabase."
      />

      <form className="login-card" onSubmit={onSubmit}>
        <label className="field">
          Email
          <input
            autoComplete="email"
            disabled={!isSupabaseConfigured || isSubmittingLogin}
            inputMode="email"
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="treino@teste.com"
            required
            type="email"
            value={authEmail}
          />
        </label>

        <label className="field">
          Senha
          <input
            autoComplete="current-password"
            disabled={!isSupabaseConfigured || isSubmittingLogin}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Sua senha"
            required
            type="password"
            value={authPassword}
          />
        </label>

        {(authError || !isSupabaseConfigured) && (
          <p className="form-message" role="alert">
            {authError || configError}
          </p>
        )}

        <button
          className="login-button"
          disabled={!isSupabaseConfigured || isSubmittingLogin}
          type="submit"
        >
          {isSubmittingLogin ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default LoginScreen;
