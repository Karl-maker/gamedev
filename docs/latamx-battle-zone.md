# LATAMX Battle Zone — Engineering Vision and 2028 Build Plan

## Executive summary

LATAMX Battle Zone is an ambitious Unreal Engine multiplayer action game in active development. The intended 2028 build brings many magical characters, melee combatants, AI-controlled forces and pirate crews into shared environments spanning land, islands and naval encounters.

The current codebase is not a completed version of that entire game. It is the new Unreal Engine 5.8 C++ foundation on which that game can be built. It already establishes several difficult architectural requirements:

- server-authoritative movement, combat and character state;
- component-based player and NPC composition;
- an explicit gameplay-system scheduler;
- indexed actor discovery rather than repeated world scans;
- a typed event bus for decoupled reactions;
- a perception, brain and action pipeline for AI;
- phase-based melee attacks with authoritative hit detection;
- request-driven, layered animation;
- data-driven character, animation, attachment and input profiles; and
- modular local-player HUD construction.

The larger vision is ambitious, but possible. The condition is disciplined delivery: prove a complete vertical slice, measure it under realistic multiplayer load, establish budgets, then expand the roster, world and naval systems on top of evidence.

## Product vision

The finished game is intended to support:

1. **Many magical characters in the same environment.** Characters should have distinct ability schools, traversal styles, counters, team roles and visual identities while sharing stable runtime contracts.
2. **Large mixed encounters.** Players, AI allies, enemies, summons and environmental threats should coexist without allowing AI, animation, collision or replication costs to grow without control.
3. **Pirate and naval battles.** Ships should support traversal, cannons, damage zones, crews, boarding and transitions between naval and character combat.
4. **A connected Caribbean-inspired world.** Islands, ports, ruins, open water and magical biomes should feel like parts of one world while using streaming and relevance boundaries behind the scenes.
5. **Readable spectacle.** Magic, melee, ships, VFX and audio must remain exciting without hiding gameplay intent from the player.
6. **Fair online play.** Clients can feel responsive, but authoritative outcomes, abuse resistance, observability and server performance must be designed in from the start.

## What the current build contains

### Character composition

`ACharacterActor` provides the shared character base. It composes focused components for control intent, replicated stats and stamina, combat requests, active attack state, move-set data, animation lookup, combat collision volumes and profile-driven visual setup.

`APlayableActor` adds local input and camera-related composition. `ANonPlayableCharacter` adds perception and brain state. Player and AI characters can therefore use the same movement and combat execution paths.

### Input and movement

Enhanced Input callbacks do not directly decide gameplay outcomes:

```text
Enhanced Input
  -> UPlayerInputComponent
  -> UControlComponent intent
  -> server RPC / replicated control state
  -> UMovementSystem
  -> replicated locomotion
  -> animation request
```

Movement is camera-relative. The server evaluates gameplay using replicated view direction, applies walk, sprint, crouch and jump rules, and publishes locomotion state for presentation.

### Stamina and statistics

`UStatsComponent` owns replicated health and stamina values. Dedicated systems handle sprint drain and regeneration. This separates attribute data from the rules that modify it and gives future abilities a single authoritative place to consume or restore resources.

### AI pipeline

AI is intentionally split into three stages:

```text
Perception -> Brain -> Action -> shared control interface
```

- `UPerceptionSystem` updates observations and threats.
- `UBrainSystem` converts observations, personality and state into intent.
- `UActionSystem` converts intent into movement or combat commands.

Perception work is interval-driven and uses spatial partitioning, movement thresholds, line-of-sight checks and short-term memory. Brain decisions are staggered. A future crowded battlefield cannot afford to run the most expensive decision path for every character every frame.

### Combat pipeline

The existing melee pipeline is server-authoritative:

```text
attack intent
  -> request throttling and validation
  -> move selection
  -> stamina/resource consumption
  -> anticipation phase
  -> active phase and combat volumes
  -> recovery phase
  -> authoritative hit resolution
  -> damage and replicated presentation
```

Combat moves define timing, animation, stamina cost and active body-part volumes. Collision is enabled only during the active window, and the detection layer prevents the same attack from repeatedly damaging one target.

This is a useful base for magic as well as melee. A future ability system can reuse the same principles—validated activation, explicit phases, resource cost, authoritative effect application and replicated presentation—without forcing every spell to be implemented as a melee move.

### Animation

Gameplay systems request animations using stable keys rather than directly manipulating bones. The animation system resolves keys, layers, transitions and montage playback on Unreal's native skeletal mesh.

The principal design choice is to rely on Unreal's AnimGraph, cached poses, layered blending, parallel animation and update-rate optimizations. A custom per-bone C++ copy path would be more expensive, harder to maintain and would duplicate work the engine already performs well.

### HUD

The HUD is owned only by the local player and is assembled from small widget components. The current life display binds to the controlled pawn's stats component. This provides a clean extension point for stamina, abilities, cooldowns, team state, ship condition and objectives.

## Runtime architecture

### Explicit scheduling

`UGameplaySystemScheduler` owns the high-level order:

```text
client input
  -> server gameplay
     -> combat input
     -> perception
     -> brain
     -> action
     -> combat detection
  -> movement and stamina
  -> client camera
  -> physics
  -> post-physics
  -> transform synchronization
```

Systems do not independently tick themselves. This makes order and authority visible and creates one place to add profiling, budgets and adaptive update frequencies.

### Actor registry

`UActorRegistry` indexes actors by component type using weak references. Systems can ask for actors with a particular capability without scanning the entire world.

The benefit is predictable query scope. The cost is that registration, component mutation and actor destruction must remain correct. This area needs lifecycle and soak-test coverage before the project scales up.

### Typed event bus

`UEventBusSubsystem` creates one channel per payload type. Systems publish and subscribe using typed Unreal structs. This separates facts such as “locomotion changed” or “an attack started” from the systems that present those facts.

The event bus reduces direct dependencies, but it should not become invisible global control flow. Event naming, ownership, ordering, logging and unsubscribe behavior need conventions and tests.

### Profile-driven assets

`UCaribbeanAssetSettings` stores stable-key profiles for skeletal meshes and Animation Blueprints, animation assets, body-part attachment bones and input mappings.

This makes the runtime more tolerant of different rigs and content sets. Magical characters can use different visuals and animation libraries while preserving shared gameplay contracts.

## Principal engineer design decisions

### 1. Central scheduling instead of scattered actor ticks

**Decision:** Coordinate continuously evaluated gameplay in a world-level scheduler.

**Reason:** Execution order, authority and performance are easier to inspect when systems have an explicit phase.

**Trade-off:** The scheduler can become oversized. Each new system needs a documented owner, frequency and phase.

### 2. Components own state; systems own behavior

**Decision:** Keep reusable state on actors and process it in world systems.

**Reason:** Player, AI and future magical characters can share the same execution logic.

**Trade-off:** Data contracts need discipline. Poorly defined components would simply move coupling rather than remove it.

### 3. Server authority at the gameplay boundary

**Decision:** Clients submit intent; the server decides movement-related gameplay, combat timing, hits, damage, resources and final state.

**Reason:** Competitive battles and large shared environments require a trusted outcome owner.

**Trade-off:** Authority alone does not guarantee good feel. Prediction, reconciliation and lag compensation are still required.

### 4. Indexed actor discovery

**Decision:** Query actors through component indexes rather than repeated global searches.

**Reason:** Future systems should pay for the actors relevant to them, not every actor in the world.

**Trade-off:** Registry correctness becomes infrastructure and must be treated as such.

### 5. Typed events for cross-cutting reactions

**Decision:** Use typed payloads for decoupled gameplay notifications.

**Reason:** Movement, combat, animation, audio, UI and telemetry should react without forming a dependency web.

**Trade-off:** Event-driven systems need observability and clear ordering rules.

### 6. Native Unreal animation

**Decision:** Use the engine's skeletal mesh, AnimGraph and montage pipeline.

**Reason:** It already provides optimized pose evaluation, layering and parallel work.

**Trade-off:** C++ and Animation Blueprint contracts must be versioned and validated together.

### 7. Stable profile keys instead of hard-coded content paths

**Decision:** Resolve visuals, animations, bones and input through project profiles.

**Reason:** Content iteration and character variation should not require gameplay code changes.

**Trade-off:** Missing or inconsistent profiles can compile successfully and fail at runtime, so validation tooling is necessary.

## What is not complete yet

The current code should not be described as already containing:

- a complete magical ability framework;
- a production-sized roster;
- a large seamless world;
- working ship simulation or naval combat;
- full prediction and reconciliation;
- matchmaking, persistence or social systems;
- release-ready security and anti-cheat;
- production content pipelines;
- complete automated gameplay/network coverage; or
- proven high-player-count server performance.

These are 2027–2028 delivery goals, not current features.

## Immediate next steps

### 1. Add automated gameplay and network tests

Cover attack transitions, resource consumption, hit deduplication, damage authority, replicated state, disconnects, destruction during callbacks and late join.

### 2. Build one magical-character vertical slice

Complete one character end to end: movement identity, primary and secondary abilities, resource and cooldown model, targeting, counterplay, authoritative effects, VFX, audio, layered animation, HUD feedback, AI usage and multiplayer correction under latency.

This slice should determine whether the existing combat contracts can be generalized or whether a dedicated Gameplay Ability System layer is justified.

### 3. Establish performance and network budgets

Measure game-thread and server-frame time, AI perception and decision cost, animation update cost, collision query count, replicated bytes per actor, memory per character, ability/VFX spawn cost and target-hardware frame pacing.

The current working target is about 20 active characters at 60 FPS on PC. That is a starting budget, not a promise of final battle scale.

### 4. Prototype prediction and lag compensation

Test player movement and at least one combat ability at representative latency and packet loss. Define which actions are predicted, which are server-confirmed and how corrections appear.

### 5. Improve observability

Replace temporary broad logging with dedicated log categories, Unreal Insights trace events, per-system timing counters, replication captures, AI/combat debug overlays and repeatable performance scenarios.

### 6. Validate naval combat as its own prototype

Before integrating ships into the world, prove authoritative ship movement, cannon firing, ship damage zones, crew/passenger replication, boarding transitions, water/physics stability and bandwidth under several ships and crews.

### 7. Introduce world scale only after the combat slice holds

Prototype World Partition, streaming, relevance and travel with representative actors and abilities. A large empty map is not proof of a scalable game; a representative encounter moving across streaming boundaries is.

## Proposed delivery roadmap

### Current foundation

- character composition and replicated state;
- movement, camera and stamina;
- AI perception, brain and action;
- melee combat phases and volumes;
- animation request pipeline;
- profile-driven assets; and
- modular HUD.

### Next vertical slice

- one production-quality magical character;
- one enemy archetype and complete encounter;
- initial ability/effect architecture;
- automated multiplayer tests;
- prediction prototype; and
- performance baseline.

### 2027 battle-scale phase

- replication relevance and prioritization;
- AI significance management;
- expanded character roster and team orchestration;
- World Partition and streaming validation;
- dedicated-server soak tests; and
- first ship-to-shore gameplay loop.

### 2028 completion target

- complete magical roster and encounter variety;
- pirate ship combat and boarding;
- progression, sessions and social features;
- accessibility and onboarding;
- content and world completion;
- optimization and security hardening;
- release validation; and
- launch/live-operations preparation.

## Main risks and mitigations

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Scope growth | Characters, ships and world content multiply each other | Gate expansion behind vertical-slice acceptance criteria |
| Network cost | Many relevant actors and effects can exceed bandwidth | Replication graph, relevance, prioritization and measured budgets |
| AI cost | Full sensing and thinking for every NPC will not scale | Spatial queries, staggered updates, significance tiers and simpler distant behavior |
| Animation/VFX overload | Spectacle can consume CPU/GPU and reduce readability | Update-rate controls, pooling, effect budgets and readability reviews |
| Event opacity | Decoupled systems can become hard to debug | Typed naming conventions, traces, event inspection and ownership docs |
| Content/profile errors | Soft paths and keys can fail at runtime | Editor validation, startup audits and automated asset checks |
| Naval complexity | Physics, crews and character transitions add a second game | Isolated naval prototype with explicit acceptance metrics |
| Insufficient testing | Multiplayer lifecycle bugs are expensive late | Functional, network, soak and deterministic scenario tests early |

## Feasibility statement

LATAMX Battle Zone is ambitious because it combines several difficult products: responsive multiplayer character combat, numerous magical archetypes, scalable AI, a streamed world and naval gameplay. It is nevertheless possible.

The current code makes sensible foundational choices for that direction. It does not remove the need for significant engineering and content work, but it gives that work understandable boundaries. The decisive factor will be sequencing: prove the smallest complete version of the experience, measure it, harden it, and only then increase breadth and population toward the 2028 target.
