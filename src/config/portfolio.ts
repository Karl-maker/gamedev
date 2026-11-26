export const portfolioConfig = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Karl-Johan Bailey",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Karl-maker",
  pirateClashUrl: process.env.NEXT_PUBLIC_PIRATE_CLASH_URL || "https://pirateclash.syncpoly.com/",
  pirateClashGooglePlayUrl: process.env.NEXT_PUBLIC_PIRATE_CLASH_GOOGLE_PLAY_URL || "https://play.google.com/store/apps/details?id=com.syncpoly.clashofpirates",
  pirateClashAppStoreUrl: process.env.NEXT_PUBLIC_PIRATE_CLASH_APP_STORE_URL || "https://apps.apple.com/us/app/clash-of-pirates-war/id6812491112",
  latamxRepoUrl: process.env.NEXT_PUBLIC_LATAMX_REPO_URL || "https://github.com/Karl-maker/caribbean-untitled-game",
  engineRepoUrl: process.env.NEXT_PUBLIC_ENGINE_REPO_URL || "https://github.com/Karl-maker/game-engine",
} as const;
