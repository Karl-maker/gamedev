export const portfolioConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Karl-Johan Bailey",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Karl-maker",
  pirateClashUrl: process.env.NEXT_PUBLIC_PIRATE_CLASH_URL || "https://pirateclash.syncpoly.com/",
  latamxRepoUrl: process.env.NEXT_PUBLIC_LATAMX_REPO_URL || "https://github.com/Karl-maker/caribbean-untitled-game",
  engineRepoUrl: process.env.NEXT_PUBLIC_ENGINE_REPO_URL || "https://github.com/Karl-maker/game-engine",
} as const;
