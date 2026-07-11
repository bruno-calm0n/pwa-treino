import type { AppTheme } from "../types";

type AppHeaderProps = {
  onToggleTheme: () => void;
  theme: AppTheme;
  title: string;
  subtitle?: string;
};

function AppHeader({
  onToggleTheme,
  theme,
  title,
  subtitle,
}: AppHeaderProps) {
  const isDarkTheme = theme === "dark";

  return (
    <div className="top-bar">
      <section className="hero" aria-labelledby="app-title">
        <p className="eyebrow">Treino diário</p>
        <h1 id="app-title">{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </section>
      <button
        className="theme-toggle"
        type="button"
        aria-pressed={isDarkTheme}
        onClick={onToggleTheme}
      >
        {isDarkTheme ? "Tema claro" : "Tema escuro"}
      </button>
    </div>
  );
}

export default AppHeader;
