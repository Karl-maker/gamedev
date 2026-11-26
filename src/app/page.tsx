import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight, ArrowUpRight, BadgeDollarSign, BarChart3, Blocks, Boxes, Braces, CheckCircle2, Code2, Cpu,
  Database, Gamepad2, Gauge, Github, GitBranch, Layers3, Mountain,
  Map, Monitor, Network, PackageOpen, Palette, Play, Rocket, ShieldCheck, Ship, Smartphone, Sparkles, Waves,
} from "lucide-react";
import {
  siAppstore, siAutodeskmaya, siBlender, siCplusplus, siGoogleplay,
  siOpengl, siUnity, siUnrealengine,
  type SimpleIcon,
} from "simple-icons";
import { portfolioConfig } from "@/config/portfolio";

const unrealSystems = [
  "Server-authoritative movement & combat", "Explicit C++ gameplay scheduler",
  "Typed event-bus and actor registry", "Layered, request-driven animation",
  "Perception, brain & action AI pipeline", "Replicated controls, stats & attack state",
];

const engineFeatures = [
  "Entity Component System", "OpenGL + GLSL rendering",
  "Chunk-based world streaming", "Async mesh loading",
  "Terrain, water, fog & post FX", "Hot-reload development tools",
];

const uefnExperience = [
  { icon: Code2, title: "Verse gameplay systems", copy: "Writing event-driven Verse logic for objectives, scoring, player state, rounds, interactions and reusable gameplay components." },
  { icon: Blocks, title: "Creative device orchestration", copy: "Connecting built-in and custom devices into reliable game loops, triggers, encounters, UI feedback and multiplayer rules." },
  { icon: Map, title: "Island & encounter building", copy: "Greyboxing spaces, composing environments, shaping traversal and pacing combat encounters around a clear player journey." },
  { icon: Rocket, title: "Iteration & publishing readiness", copy: "Playtesting, profiling memory and performance, validating multiplayer behavior and preparing islands for Creator Portal review." },
];

const productSystems = [
  {
    icon: BarChart3,
    title: "Game analytics",
    copy: "Designing useful event taxonomies for sessions, progression, combat, economy and conversion—then reading funnels, retention and drop-off signals to guide improvements.",
  },
  {
    icon: BadgeDollarSign,
    title: "Google AdMob rewarded ads",
    copy: "Integrating opt-in rewarded ads with test inventory, load and failure states, completion callbacks, reward delivery and placements that preserve the core game loop.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible product decisions",
    copy: "Using telemetry and monetization carefully: clear player value, sensible frequency controls, consent-aware measurement and validation before production rollout.",
  },
];

const engineDepth = [
  { icon: Gauge, title: "Deterministic runtime", copy: "A controlled C++ main loop with explicit timing, input processing, configurable frame caps, VSync control and separate CPU/GPU profiling." },
  { icon: Boxes, title: "Data-oriented ECS", copy: "Components remain pure data while systems, factories and services own behavior—keeping simulation modular, testable and extensible." },
  { icon: Mountain, title: "Real-time renderer", copy: "OpenGL and GLSL rendering for terrain, water LOD, instanced grass and rocks, procedural sky, fog, motion blur and depth of field." },
  { icon: Database, title: "Streamed worlds", copy: "JSON-authored chunks load and unload by player proximity through a pluggable world source and spatial-query services." },
  { icon: PackageOpen, title: "Asset pipeline", copy: "Asynchronous glTF loading with submeshes, PBR materials, skeletons, animation data and common texture-channel support." },
  { icon: GitBranch, title: "Developer tooling", copy: "Runtime hot reload, source-watch rebuilds, debug overlays, world diagnostics and live shader/content iteration shorten the feedback loop." },
];

const craft = [
  { icon: Gamepad2, title: "Gameplay", copy: "Responsive combat, movement, progression, input, camera and moment-to-moment game feel." },
  { icon: Network, title: "Multiplayer", copy: "Authoritative network architecture, replicated state and systems designed for online play." },
  { icon: Palette, title: "3D art", copy: "Asset workflows across Blender, Maya, materials, animation, lighting and environment composition." },
  { icon: Cpu, title: "Engine tech", copy: "C++, ECS architecture, OpenGL rendering, shaders, profiling and data-driven tools." },
];

const techLogos: Array<{ name: string; icon?: SimpleIcon; image?: string }> = [
  { name: "Unreal Engine", icon: siUnrealengine },
  { name: "Unity", icon: siUnity },
  { name: "C++", icon: siCplusplus },
  { name: "OpenGL", icon: siOpengl },
  { name: "Blender", icon: siBlender },
  { name: "Autodesk Maya", icon: siAutodeskmaya },
  { name: "AWS", image: "/portfolio/aws-logo.svg" },
];

export default function Home() {
  return (
    <div className="game-portfolio">
      <section className="game-hero" id="top">
        <div className="game-hero-worlds" aria-hidden="true">
          <div className="game-hero-world game-hero-world-pirate">
            <Image src="/portfolio/pirate-clash-banner.png" alt="" fill priority sizes="62vw" />
            <div className="game-world-mark game-world-mark-pirate"><b>01</b><span>Released worldwide</span></div>
          </div>
          <div className="game-hero-world game-hero-world-latamx">
            <Image src="/portfolio/fortnite-blitz-royale.jpg" alt="" fill priority sizes="62vw" />
            <div className="game-world-mark game-world-mark-latamx"><b>02</b><span>In production</span></div>
          </div>
          <div className="game-split-spine"><span>Selected worlds</span></div>
        </div>
        <div className="game-hero-overlay" />
        <div className="game-grid-overlay" />
        <div className="game-container game-hero-content">
          <div className="game-status"><span /> Available for game development projects</div>
          <p className="game-kicker">Game developer · Engine programmer · UEFN creator · 3D generalist</p>
          <h1>I build worlds<br />worth playing.</h1>
          <p className="game-hero-lede">Production-minded games and interactive worlds across Unreal Engine, UEFN, Verse, Unity, C++, multiplayer systems and real-time 3D.</p>
          <div className="game-actions">
            <a className="game-button game-button-primary" href="#work">Explore selected work <ArrowDownRight /></a>
            <a className="game-button game-button-ghost" href={portfolioConfig.githubUrl} target="_blank" rel="noreferrer"><Github /> GitHub profile</a>
          </div>
          <div className="game-hero-projects" aria-label="Featured games">
            <div className="game-hero-project game-hero-project-pirate">
              <span><i /> Live now · Unity</span>
              <strong><Ship /> Clash of Pirates</strong>
              <small>Mobile naval arcade survival</small>
              <div className="game-store-links">
                <a href={portfolioConfig.pirateClashGooglePlayUrl} target="_blank" rel="noreferrer" aria-label="Download Clash of Pirates on Google Play">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siGoogleplay.path} /></svg>
                  <b><em>Get it on</em>Google Play</b>
                </a>
                <a href={portfolioConfig.pirateClashAppStoreUrl} target="_blank" rel="noreferrer" aria-label="Download Clash of Pirates on the App Store">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siAppstore.path} /></svg>
                  <b><em>Download on the</em>App Store</b>
                </a>
              </div>
            </div>
            <div className="game-hero-project game-hero-project-latamx">
              <span><i /> Coming 2028 · Unreal Engine 5</span>
              <strong><Sparkles /> LATAMX Battle Zone</strong>
              <small>Magic, mass battles and piracy</small>
              <Link className="game-pc-link" href="/projects/latamx-battle-zone"><Monitor /> PC development <ArrowUpRight /></Link>
            </div>
          </div>
        </div>
        <div className="game-scroll-label">Selected work <span /></div>
      </section>

      <section className="game-intro game-container">
        <p className="game-section-index">01 / Profile</p>
        <div><h2>From the first line of engine code to the final player experience.</h2><p>I work across the full real-time stack: gameplay architecture, multiplayer, UEFN and Verse development, rendering, technical art, 3D pipelines and polished cross-platform delivery.</p></div>
      </section>

      <section className="game-logo-wall" aria-label="Technology experience">
        <div className="game-container">
          <p>Production and R&amp;D experience across</p>
          <div>
            {techLogos.map((technology) => (
              <span key={technology.name} title={technology.name}>
                {technology.icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={technology.icon.path} /></svg> : <Image src={technology.image!} alt="" width={46} height={46} />}
                <b>{technology.name}</b>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="game-uefn">
        <div className="game-container">
          <div className="game-uefn-heading">
            <div>
              <span className="game-label">Fortnite creation · UEFN / Verse</span>
              <h2>Building Fortnite experiences as complete game systems.</h2>
            </div>
            <div>
              <p>I use Unreal Editor for Fortnite to move from island concept to playable multiplayer experience—combining Verse code, Creative devices, level design and rapid in-editor testing. The focus is not only visual building, but clear rules, readable objectives, reliable state and a game loop players understand immediately.</p>
              <div className="game-uefn-toolbelt"><span>UEFN</span><span>Verse</span><span>Fortnite Creative</span><span>Sequencer</span><span>Niagara</span><span>World building</span></div>
            </div>
          </div>
          <div className="game-uefn-grid">
            {uefnExperience.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}>
                <div><span>0{index + 1}</span><Icon /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="game-uefn-note">Fortnite, UEFN and related marks belong to Epic Games. Tool experience does not imply endorsement or affiliation.</p>
        </div>
      </section>

      <section className="game-project game-project-featured" id="work">
        <div className="game-container">
          <div className="game-project-heading"><div><span className="game-label">Flagship release · Unity</span><h2>Clash of Pirates</h2></div><span className="game-project-number">01</span></div>
          <a className="game-project-visual" href={portfolioConfig.pirateClashUrl} target="_blank" rel="noreferrer" aria-label="Visit the Clash of Pirates website">
            <Image src="/portfolio/pirate-clash-banner.png" alt="Clash of Pirates naval survival gameplay" fill sizes="(max-width: 1200px) 100vw, 1200px" />
            <div className="game-project-visual-shade" />
            <div className="game-project-badge"><Play fill="currentColor" /> Live on iOS & Android</div>
            <span className="game-visit">View live game <ArrowUpRight /></span>
          </a>
          <div className="game-project-details">
            <div className="game-project-summary"><span className="game-mini-icon"><Ship /></span><p>A complete mobile arcade-survival game where players command a pirate ship, dodge enemy fire, survive escalating waves and build a devastating combat loadout.</p></div>
            <div className="game-facts"><div><span>Role</span><strong>Game developer / creator</strong></div><div><span>Built with</span><strong>Unity · C# · Mobile</strong></div><div><span>Product systems</span><strong>Analytics · AdMob rewarded ads</strong></div><div><span>Released on</span><strong>App Store · Google Play</strong></div></div>
          </div>
        </div>
      </section>

      <section className="game-product-systems">
        <div className="game-container">
          <div className="game-product-heading">
            <p className="game-section-index">02 / Product systems</p>
            <div>
              <span className="game-label">Analytics · Monetization · Live improvement</span>
              <h2>Understanding the game after players press start.</h2>
              <p>I use game analytics to understand real player behavior and improve pacing, balance, progression and retention. I also have experience integrating Google AdMob rewarded ads as an optional value exchange—designed around player choice rather than interruption.</p>
            </div>
          </div>
          <div className="game-product-grid">
            {productSystems.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}>
                <div><span>0{index + 1}</span><Icon /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="game-project game-project-dark">
        <div className="game-container game-unreal-grid">
          <div className="game-unreal-copy">
            <div className="game-project-heading"><div><span className="game-label">New build · In development through 2028</span><h2>LATAMX Battle Zone</h2></div><span className="game-project-number">02</span></div>
            <p className="game-project-lede">An ambitious Unreal Engine 5.8 multiplayer action world where magical characters, melee fighters and pirate crews are designed to share one authoritative battlefield. The current C++ build establishes the combat, AI, movement, animation and replication foundation needed to make that 2028 vision achievable.</p>
            <ul className="game-system-list">{unrealSystems.map((system) => <li key={system}><CheckCircle2 />{system}</li>)}</ul>
            <div className="game-actions">
              <Link className="game-button game-button-primary" href="/projects/latamx-battle-zone">Read the engineering case study <ArrowUpRight /></Link>
            </div>
          </div>
          <div className="game-unreal-showcase">
            <a className="game-unreal-media" href={portfolioConfig.latamxRepoUrl} target="_blank" rel="noreferrer">
              <Image src="/portfolio/fortnite-blitz-royale.jpg" alt="Unreal Engine multiplayer visual reference for LATAMX Battle Zone" fill sizes="(max-width: 900px) 100vw, 56vw" />
              <span><Github /> Explore the current C++ build <ArrowUpRight /></span>
              <small>Visual reference · Epic Games artwork · project code is original work</small>
            </a>
            <div className="game-architecture-card">
              <div className="game-card-top"><span><Braces /> SYSTEM FLOW</span><i>UE C++</i></div>
              <div className="game-flow"><span>INPUT</span><b>→</b><span>GAMEPLAY</span><b>→</b><span>MOVEMENT</span><span>PHYSICS</span><b>→</b><span>POST PHYSICS</span><b>→</b><span>TRANSFORM</span></div>
              <div className="game-code-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
              <div className="game-architecture-footer"><span><Network /> Replicated</span><span><Layers3 /> System-driven</span><span><Sparkles /> Animation layers</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="game-cloud">
        <div className="game-container game-cloud-grid">
          <div className="game-cloud-mark">
            <Image src="/portfolio/aws-logo.svg" alt="Amazon Web Services" width={210} height={126} />
            <span>Cloud experience</span>
          </div>
          <div className="game-cloud-copy">
            <span className="game-label">AWS · Cloud delivery</span>
            <h2>Games need dependable systems beyond the client.</h2>
            <p>Experience using AWS for secure hosting, content delivery, storage, APIs and production infrastructure—bringing game builds and connected experiences from local development to reliable cloud delivery.</p>
            <div className="game-cloud-services">
              <span>CloudFront / CDN</span><span>S3 storage</span><span>API workloads</span><span>Deployment &amp; CI/CD</span><span>Monitoring</span><span>Scalable backends</span>
            </div>
          </div>
        </div>
      </section>

      <section className="game-engine game-container">
        <div className="game-engine-copy">
          <p className="game-section-index">03 / Engine R&amp;D</p><span className="game-label">Custom technology · C++ / OpenGL</span><h2>Duppy Engine</h2>
          <p>A research-driven game engine built from the ground up: deterministic loop, ECS gameplay, streamed worlds, real-time graphics and developer tooling.</p>
          <div className="game-actions"><a className="game-button game-button-primary" href={portfolioConfig.engineRepoUrl} target="_blank" rel="noreferrer"><Github /> Explore source <ArrowUpRight /></a></div>
        </div>
        <div className="game-engine-console">
          <div className="game-console-bar"><span /><span /><span /><b>duppy / renderer</b></div>
          <div className="game-console-world"><div className="game-sun" /><div className="game-mountain mountain-a" /><div className="game-mountain mountain-b" /><div className="game-water" /><div className="game-console-hud"><span>144 FPS</span><span>WORLD 04</span><span>CHUNKS 18</span></div></div>
          <div className="game-engine-features">{engineFeatures.map((feature) => <span key={feature}><Boxes />{feature}</span>)}</div>
        </div>
      </section>

      <section className="game-engine-depth game-container">
        <div className="game-engine-depth-heading">
          <span className="game-label">Inside the architecture</span>
          <h2>More than a renderer.<br />A complete game runtime.</h2>
          <p>Duppy Engine explores the systems that commercial engines normally hide: scheduling, entity lifetime, asset ingestion, streamed world state, rendering and the tooling needed to understand every frame.</p>
        </div>
        <div className="game-engine-depth-grid">
          {engineDepth.map(({ icon: Icon, title, copy }, index) => (
            <article key={title}>
              <div><span>0{index + 1}</span><Icon /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="game-craft">
        <div className="game-container">
          <div className="game-craft-heading"><p className="game-section-index">04 / Capabilities</p><h2>Technical depth.<br />Creative range.</h2></div>
          <div className="game-craft-grid">{craft.map(({ icon: Icon, title, copy }, index) => <article key={title}><span>0{index + 1}</span><Icon /><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <div className="game-toolbelt"><span>Unreal Engine 4/5</span><span>UEFN</span><span>Verse</span><span>Fortnite Creative</span><span>Unity</span><span>C++</span><span>C#</span><span>Game analytics</span><span>Google AdMob</span><span>Rewarded ads</span><span>OpenGL</span><span>GLSL</span><span>Blender</span><span>Autodesk Maya</span><span>Git</span><span>AWS</span></div>
        </div>
      </section>

      <section className="game-contact game-container" id="contact">
        <div><span className="game-label">Have a world in mind?</span><h2>Let’s make it playable.</h2></div>
        <a className="game-contact-link" href={portfolioConfig.githubUrl} target="_blank" rel="noreferrer">Start a conversation on GitHub <ArrowUpRight /></a>
        <div className="game-contact-orbit"><Waves /></div><Smartphone className="game-contact-icon" />
      </section>
    </div>
  );
}
