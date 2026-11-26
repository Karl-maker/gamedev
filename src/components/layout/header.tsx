import Link from "next/link";

export function Header() {
  return (
    <header className="site-header game-site-header">
      <div className="game-container game-nav">
        <Link className="game-brand" href="/"><span>KJB</span><b>Karl-Johan Bailey</b></Link>
        <nav aria-label="Portfolio navigation">
          <Link href="/#work">Work</Link><Link href="/#contact">Contact</Link>
          <a href="https://github.com/Karl-maker" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </div>
    </header>
  );
}
