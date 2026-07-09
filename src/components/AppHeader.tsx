type AppHeaderProps = {
  title: string;
  // subtitle: string;
};

function AppHeader({ title, 
  // subtitle
 }: AppHeaderProps) {
  return (
    <div className="top-bar">
      <section className="hero" aria-labelledby="app-title">
        <p className="eyebrow">Treino diário</p>
        <h1 id="app-title">{title}</h1>
        {/* <p className="subtitle">{subtitle}</p> */}
      </section>
    </div>
  );
}

export default AppHeader;
