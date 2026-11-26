import { portfolioConfig } from "@/config/portfolio";

export function Footer() {
  return (
    <footer className="game-footer">
      <div className="game-container"><span>© {new Date().getFullYear()} {portfolioConfig.name}</span><span>Game developer · Engine programmer · 3D generalist</span><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}
