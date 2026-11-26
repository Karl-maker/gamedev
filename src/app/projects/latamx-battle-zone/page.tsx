import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Brain, Braces, CheckCircle2, CircleDashed,
  Cpu, Github, Layers3, Network, Radar, ShieldCheck, Ship, Sparkles,
  Swords, Users, WandSparkles, Waves,
} from "lucide-react";
import { portfolioConfig } from "@/config/portfolio";

export const metadata: Metadata = {
  title: "LATAMX Battle Zone — Unreal Engine Case Study",
  description: "An in-depth look at the current Unreal Engine C++ build, principal engineering decisions, 2028 vision and delivery roadmap for LATAMX Battle Zone.",
  alternates: { canonical: "/projects/latamx-battle-zone" },
};

const currentCapabilities = [
  { icon: Network, title: "Authoritative multiplayer foundation", copy: "Clients submit intent; the server owns movement decisions, attack timing, hit detection, damage, stamina and replicated gameplay state." },
  { icon: Swords, title: "Phase-based melee combat", copy: "Attacks move through anticipation, active and recovery windows, with data-defined moves, stamina costs, body-part combat volumes and per-attack hit deduplication." },
  { icon: Brain, title: "Composable NPC intelligence", copy: "Perception produces observations, the brain converts them into intent, and the action system turns intent into the same control interface used by players." },
  { icon: Layers3, title: "Layered animation requests", copy: "Gameplay publishes animation intent by stable keys. A central system resolves transitions and plays dynamic montages over native Unreal skeletal animation." },
  { icon: Radar, title: "Performance-aware perception", copy: "Interval-based updates, spatial partitioning, movement thresholds, line-of-sight tests and short-term memory reduce unnecessary AI work." },
  { icon: ShieldCheck, title: "Replicated character state", copy: "Control, locomotion, stats, visual profiles and combat animation triggers are designed around clear server ownership and client presentation." },
  { icon: Cpu, title: "Explicit frame orchestration", copy: "A world-level scheduler owns system order across gameplay, movement, physics, post-physics and transform phases instead of scattering logic across actor ticks." },
  { icon: Braces, title: "Data and profile-driven setup", copy: "Stable keys select character visuals, animation sets, combat attachment bones and input mappings so content can change without rewriting gameplay code." },
];

const decisions = [
  {
    title: "Central scheduling over uncontrolled ticking",
    decision: "Continuously evaluated gameplay is coordinated by UGameplaySystemScheduler.",
    reason: "A known execution order makes multiplayer bugs, frame dependencies and performance costs easier to reason about.",
    tradeoff: "The scheduler can become a bottleneck if ownership rules and phase boundaries are not kept explicit.",
  },
  {
    title: "Components own state; systems own behavior",
    decision: "Actors are composed from focused components, while world systems process groups of actors.",
    reason: "The same movement and combat path can serve players, AI and future magical characters without duplicating behavior.",
    tradeoff: "Cross-system contracts need strong naming, lifecycle handling and tests to avoid hidden coupling.",
  },
  {
    title: "Server authority at the gameplay boundary",
    decision: "Clients communicate intent, but the server decides outcomes.",
    reason: "This is the safest base for competitive battles, many simultaneous characters and later naval combat.",
    tradeoff: "Responsive online play will still require prediction, reconciliation, lag compensation and network-budget work.",
  },
  {
    title: "Registry queries instead of repeated world scans",
    decision: "An actor registry indexes weak actor references by component type.",
    reason: "Systems can find relevant actors without calling broad world searches every frame.",
    tradeoff: "Registration and component lifecycle correctness become critical and must be covered by soak tests.",
  },
  {
    title: "Typed events for cross-cutting reactions",
    decision: "A world event bus connects movement, attacks and animation through typed payloads.",
    reason: "Producers do not need direct knowledge of every presentation or reaction system.",
    tradeoff: "Event ownership, ordering and observability need conventions so debugging remains straightforward.",
  },
  {
    title: "Native Unreal animation for pose evaluation",
    decision: "The runtime uses the character skeletal mesh, AnimGraph, cached poses and layered blending.",
    reason: "Unreal already provides optimized hierarchy traversal, parallel animation and update-rate controls.",
    tradeoff: "Animation Blueprint and C++ contracts must be documented and validated together.",
  },
];

const visionFeatures = [
  { icon: WandSparkles, title: "A broad magical roster", copy: "Distinct magical characters with elemental schools, movement identities, counters, status effects and team roles—all built on shared ability contracts." },
  { icon: Users, title: "Many characters in one encounter", copy: "Crowded battles with players, AI allies, enemies and summoned entities, supported by relevance, AI budgets and scalable replication." },
  { icon: Ship, title: "Pirate and naval battles", copy: "Crewable ships, cannon combat, boarding, ship damage zones, ocean traversal and transitions between deck combat and land encounters." },
  { icon: Waves, title: "A connected Caribbean-inspired world", copy: "Islands, ports, open water, ruins and magical biomes connected through world partitioning, streaming and persistent match or session state." },
  { icon: Sparkles, title: "Readable spectacle", copy: "Layered animation, VFX and audio that make large magical battles exciting without hiding attack intent or overwhelming players." },
  { icon: ShieldCheck, title: "Fair online competition", copy: "Authoritative outcomes, abuse resistance, telemetry, matchmaking inputs and server performance targets designed into the game rather than added at the end." },
];

const roadmap = [
  { period: "Foundation · current build", status: "Implemented", items: ["Character composition and replication", "Input, movement, stamina and camera", "Perception → brain → action AI", "Melee attack phases and collision volumes", "Layered animation request pipeline", "Profile-driven assets and modular HUD"] },
  { period: "Vertical slice · next", status: "Next", items: ["One complete magical character", "One enemy archetype and encounter", "Ability framework, effects and cooldowns", "Prediction/reconciliation prototype", "Automated multiplayer combat tests", "Profiling baseline on target hardware"] },
  { period: "Battle scale · 2027", status: "Planned", items: ["Replication graph and relevance budgets", "AI significance and level-of-detail behavior", "World Partition and streaming prototype", "Expanded roster and team combat", "Dedicated-server soak testing", "First playable ship-to-shore loop"] },
  { period: "Content and completion · 2028", status: "Target", items: ["Magical roster and encounter variety", "Pirate ship combat and boarding", "Progression, session and social systems", "Accessibility and onboarding", "Performance, security and live-operations readiness", "Release-quality content, polish and validation"] },
];

export default function LatamxBattleZonePage() {
  return (
    <div className="game-portfolio latamx-page">
      <section className="latamx-hero">
        <Image src="/portfolio/fortnite-blitz-royale.jpg" alt="Large-scale multiplayer battle visual reference" fill priority sizes="100vw" />
        <div className="latamx-hero-shade" />
        <div className="game-container latamx-hero-content">
          <Link className="latamx-back" href="/#work"><ArrowLeft /> Back to selected work</Link>
          <span className="game-label">Unreal Engine 5.8 · C++ · New build · Target completion 2028</span>
          <h1>LATAMX<br />Battle Zone</h1>
          <p>An ambitious multiplayer action world designed to bring many magical characters, melee fighters and pirate crews into the same living battlefield.</p>
          <div className="latamx-hero-actions">
            <a className="game-button game-button-primary" href={portfolioConfig.latamxRepoUrl} target="_blank" rel="noreferrer"><Github /> Explore current source <ArrowUpRight /></a>
            <a className="game-button game-button-ghost" href="#architecture">Read the architecture</a>
          </div>
          <div className="latamx-status-grid">
            <div><span>Status</span><strong>Active development</strong></div>
            <div><span>Current focus</span><strong>Gameplay foundation</strong></div>
            <div><span>Primary target</span><strong>PC · 60 FPS</strong></div>
            <div><span>Current scale budget</span><strong>~20 active characters</strong></div>
          </div>
        </div>
      </section>

      <section className="game-container latamx-intro">
        <span className="game-section-index">01 / The new build</span>
        <div>
          <h2>Build the rules first.<br />Then grow the world.</h2>
          <p>This is not being presented as a finished game. It is the new C++ production foundation intended to carry LATAMX Battle Zone toward a 2028 completion target. The code currently proves the hardest structural ideas: authoritative multiplayer ownership, ordered systems, reusable character composition, AI decision flow, phased combat and data-driven presentation.</p>
          <p>The long-term game is much larger: numerous magical characters fighting in shared spaces, land and pirate battles, ships, abilities, progression and a connected world. That scope is ambitious, but it is possible if the project grows through measured vertical slices, performance budgets and clear system boundaries.</p>
        </div>
      </section>

      <section className="latamx-section latamx-section-light">
        <div className="game-container">
          <div className="latamx-section-heading"><span className="game-section-index">02 / In the code now</span><h2>A real gameplay foundation, not a concept-only pitch.</h2></div>
          <div className="latamx-capability-grid">
            {currentCapabilities.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon /></div><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="latamx-section" id="architecture">
        <div className="game-container">
          <div className="latamx-section-heading"><span className="game-section-index">03 / Runtime architecture</span><h2>One path from intent to authoritative outcome.</h2></div>
          <div className="latamx-flow" aria-label="Gameplay processing flow">
            <div><span>01</span><strong>Input or AI intent</strong><small>PlayerInput / Brain</small></div><b>→</b>
            <div><span>02</span><strong>Control state</strong><small>Replicated component</small></div><b>→</b>
            <div><span>03</span><strong>Scheduled systems</strong><small>Movement / Combat / AI</small></div><b>→</b>
            <div><span>04</span><strong>Server outcome</strong><small>Hit / Damage / State</small></div><b>→</b>
            <div><span>05</span><strong>Presentation</strong><small>Animation / HUD / Camera</small></div>
          </div>
          <div className="latamx-architecture-notes">
            <article><h3>Character composition</h3><p><code>ACharacterActor</code> is the shared base. Player and NPC specializations add only the components they need. Control, stats, combat, attack state, move sets and animation data remain focused and replaceable.</p></article>
            <article><h3>Frame ownership</h3><p><code>UGameplaySystemScheduler</code> executes major work in an explicit order. Server-only decisions are separated from local camera and presentation work, making authority visible in the frame model.</p></article>
            <article><h3>Efficient discovery</h3><p><code>UActorRegistry</code> maintains weak references and component indexes. Systems query a relevant set instead of repeatedly searching every actor in the world.</p></article>
            <article><h3>Decoupled reactions</h3><p><code>UEventBusSubsystem</code> publishes typed payloads. Movement can request animation and combat can trigger presentation without those systems directly owning one another.</p></article>
          </div>
        </div>
      </section>

      <section className="latamx-section latamx-section-panel">
        <div className="game-container">
          <div className="latamx-section-heading"><span className="game-section-index">04 / Principal engineer decisions</span><h2>Choices made for scale, clarity and long-term change.</h2></div>
          <div className="latamx-decisions">
            {decisions.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p><strong>Decision:</strong> {item.decision}</p><p><strong>Why:</strong> {item.reason}</p><p><strong>Trade-off:</strong> {item.tradeoff}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="latamx-section">
        <div className="game-container">
          <div className="latamx-section-heading"><span className="game-section-index">05 / 2028 game vision</span><h2>Magic, mass battles and piracy in one systemic world.</h2></div>
          <div className="latamx-vision-grid">
            {visionFeatures.map(({ icon: Icon, title, copy }) => <article key={title}><Icon /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <aside className="latamx-reality-check">
            <CircleDashed />
            <div><h3>Ambitious, but possible</h3><p>The vision is feasible because the current architecture already separates state, behavior, authority and presentation. Success depends on resisting “build everything at once”: prove one magical combat loop, measure it, scale it to a representative battle, then add ships and world breadth on top of validated budgets.</p></div>
          </aside>
        </div>
      </section>

      <section className="latamx-section latamx-section-light">
        <div className="game-container">
          <div className="latamx-section-heading"><span className="game-section-index">06 / Delivery roadmap</span><h2>A staged path from foundation to a complete 2028 build.</h2></div>
          <div className="latamx-roadmap">
            {roadmap.map((phase, index) => (
              <article key={phase.period}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><small>{phase.status}</small></div>
                <h3>{phase.period}</h3>
                <ul>{phase.items.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="latamx-section">
        <div className="game-container latamx-next">
          <div><span className="game-section-index">07 / Immediate engineering priorities</span><h2>What should improve next.</h2></div>
          <ol>
            <li><strong>Automate the foundation.</strong><span>Add Unreal functional and network tests for attack phases, damage authority, stamina, replication and actor lifecycle.</span></li>
            <li><strong>Prove one magical vertical slice.</strong><span>Implement one complete character with abilities, effects, counterplay, UI, animation, audio and multiplayer behavior.</span></li>
            <li><strong>Add prediction deliberately.</strong><span>Prototype client prediction, reconciliation and lag compensation against measured latency—not assumptions.</span></li>
            <li><strong>Establish budgets.</strong><span>Profile CPU, server frame time, bandwidth, AI, animation, collision and memory on target hardware with 20 representative actors.</span></li>
            <li><strong>Harden observability.</strong><span>Replace noisy temporary logging with categories, counters, traces and repeatable performance captures.</span></li>
            <li><strong>Prototype naval combat separately.</strong><span>Validate ship movement, cannon authority, crew replication and boarding transitions before connecting them to the main world.</span></li>
          </ol>
        </div>
      </section>

      <section className="game-container latamx-cta">
        <WandSparkles />
        <div><span className="game-label">Engineering case study</span><h2>The goal is spectacle supported by systems.</h2><p>LATAMX Battle Zone is a long-horizon build. The current code is the beginning of a disciplined route toward the larger magical and pirate battlefield planned for 2028.</p></div>
        <a className="game-button game-button-primary" href={portfolioConfig.latamxRepoUrl} target="_blank" rel="noreferrer"><Github /> View source <ArrowUpRight /></a>
      </section>
    </div>
  );
}
