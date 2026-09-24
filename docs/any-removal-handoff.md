# Removing the last `any` in `server/` — handoff

Status as of this document: **`server/` has exactly one `any`**, and
`@typescript-eslint/no-explicit-any` is `'error'` for `server/` and `test/`. Three stub-based
unit specs (`CardAbility.displayMessage`, `cardaction`, `triggeredability`) opt out with a
file-level `eslint-disable` stating why.

Gates are green: `npm run typecheck` → 0, `npm test` → 10597 specs / 0 failures,
`npx eslint server/` → clean.

---

## 1. The remaining `any`

`server/game/GameActions/GameActions.ts`:

```ts
// The `any` is load-bearing. Card authors write this callback both untyped
// (`context => ...`) and narrowed (`(context: AbilityContext<SomeCard>) => ...`),
// and many bodies read off `context` in ways that only compiled because it was
// `any`. ...
type PropsFactory<Props, _Target = unknown> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Props | ((context: any) => Props);
```

Every card ability's property factory — `AbilityDsl.actions.draw(context => ({ ... }))` —
takes its `context` through this type. The `Props` side is fully checked already; only
the `context` parameter is untyped.

### The end state

Type the context and thread a generic through the action factories:

```ts
type PropsFactory<Props, _Target = unknown, C extends AbilityContext = AbilityContext> =
    Props | ((context: C) => Props);

export function draw<Target = unknown, C extends AbilityContext = AbilityContext>(
    propertyFactory: PropsFactory<DrawProperties, NoInfer<Target>, C> = {}
): PlayerAction { ... }
```

The generic `C` with a default is what lets a card annotate its callback
(`(context: TriggeredAbilityContext) => ...`) without a contravariance rejection.

---

## 2. How to measure progress

There is no partial-credit build: the tree does not compile until every error is fixed.
So work with the end state applied temporarily and let the compiler drive.

```bash
cd jigoku
cp server/game/GameActions/GameActions.ts /tmp/ga.orig
python3 - <<'PY'
import re
p = 'server/game/GameActions/GameActions.ts'
s = open(p).read()
s = s.replace(
    "    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    Props | ((context: any) => Props);",
    "    Props | ((context: C) => Props);")
s = s.replace(
    "type PropsFactory<Props, _Target = unknown> =",
    "type PropsFactory<Props, _Target = unknown, C extends AbilityContext = AbilityContext> =")
s = re.sub(r"export function (\w+)<Target = unknown>\(",
           r"export function \1<Target = unknown, C extends AbilityContext = AbilityContext>(", s)
s = re.sub(r"PropsFactory<(\w+), NoInfer<Target>>", r"PropsFactory<\1, NoInfer<Target>, C>", s)
s = "import type { AbilityContext } from '../AbilityContext.js';\n" + s
open(p, 'w').write(s)
PY

npx tsc --noEmit 2>&1 | grep "error TS" > /tmp/E.txt
wc -l /tmp/E.txt

# ALWAYS restore before committing or running the suite
cp /tmp/ga.orig server/game/GameActions/GameActions.ts
```

**Baseline: 214 errors across 149 files.** Re-measured at 216 / 151 before the `.event`
pass in §3.2; 199 after it.

Fixes applied to card files while the probe is active also compile without it (the
context is `any` there, so a guard or an annotation is always valid). That is what makes
incremental progress possible: edit under the probe, then restore `GameActions.ts` and
confirm `npx tsc --noEmit` is still 0 and the suite still passes.

---

## 3. What is left, by bucket

| bucket | errors | files | nature |
|---|---:|---:|---|
| `context.targets` / `context.costs` bag | 79 | 51 | done (casts) |
| props object shape | 60 | 55 | per-card |
| other (mixed, per-card) | 38 | 34 | per-card |
| context lacks `.event` | 17 | 13 | mechanical annotation |
| DrawCard-only member on `BaseCard` | 15 | 12 | done (annotations) |
| callback variance | 5 | 5 | method-vs-arrow syntax |

Counts are from the 199 baseline, before these passes. **Current probe total: 41 errors across 36 files.**

Since then (97 → 41): the `.event` leftovers (`RoadToShakyakuMura`, `IllusionaryTerrain`),
`MischievousTanuki` (`type TanukiContext = AbilityContext & { fateTaken?: number }`, which retires
its `@ts-expect-error`), the callback-variance files (annotate `AbilityContext<this>`;
`TwinSoulTemple` uses `AbilityContext & { element: ElementSymbol }`), and ~37 `target:
context.source.parentCharacter` / `.parent` sites given `?? []` (every `getProperties` override
goes through the base, which filters a `null` target to `[]`; array targets use
`.filter((card) => card !== null)`, since a nested `[]` would survive). `ClaimFavorProperties.target`
was widened to `Player | Player[]`, which is what `getProperties` produces anyway.

### 3.1 The bag (79 errors, 51 files) — decided, done

`AbilityContext` holds two untyped bags:

```ts
targets: Record<string, BaseCard | BaseCard[]>;
costs: Record<string, unknown>;
```

`context.targets.someName` is `BaseCard | BaseCard[]` because whether an entry is one card
or many depends on that target's `mode` (`TargetMode.Single` vs `Unlimited`/`UpTo`/...).
`context.costs.someName` is `unknown`. Cards then do
`(context.targets.character as DrawCard).isParticipating()`.

`context.targets` is a **name-keyed map, not a list**. A `TargetMode.Select` target writes
only to `context.selects`, never to `context.targets`.

**Decided: cast at the read.** `(context.targets.character as DrawCard)` is acceptable for bag
reads (the repo owner, after the attempts below). Keep the cast to the plain type; no helpers.

**Progress:** casts applied at every direct and local-variable bag read (≈45 files). Probe:
199 → 121. `VoidWielder`'s nested `effectArgs` now return `[card]` (chat output unchanged:
`CardAbility.displayMessage` concats, so card and `[card]` format the same);
`SelectTokenProperties.effectArgs` was widened from `string[]` to `EffectArg[]` to match
`SelectCardAction`. `context.target = card` inside `subActionProperties` (declared `BaseCard | BaseCard[]`; all
9 uses are single selects) is fixed by annotating the parameter, `(card: ProvinceCard) =>` or
`(card: DrawCard) =>`, as ExposedCourtyard already did (method-syntax parameters are bivariant).
Follow-on `context.target?.getStrength() > n` reads became
`((context.target as ProvinceCard | undefined)?.getStrength() ?? 0) > n` (same result when
undefined). What remains is the `IsawaTsuke2` `@ts-expect-error` that only the probe makes unused.

**Three approaches have been tried and rejected by the repo owner:**

1. `TargetMap` — a per-card type listing each target name and its type, passed as a type
   argument. Rejected: it restates the target declaration that is already right there in
   the card, so every card carried the same information twice.
2. Conditional/mapped types (`MultiMode`, `TargetElem`, `TargetsOf`) deriving the element
   type from the declared mode. Rejected as unreadable.

3. Declared target objects — `const character = AbilityDsl.targets.card({...})`, put in
   `targets: { character }`, read as `character.of(context)` with a runtime kind check.
   Prototyped on `Logistics`, `TheFiresOfJustice`, `WhiteLotusMethod` (green, cast-free).
   Rejected: `character.of(context)` reads badly.

Inferring the types from the inline declaration was also checked and **does not work**, so
do not retry it: TypeScript types a nested `AbilityDsl.actions.x(context => ...)` factory from
the expected return type only when that type is already fixed, not while the `targets` names
are still being inferred in the same call; and a dependent target (`dependsOn`) reading an
earlier target is a self-reference, which silently falls back to an untyped context. Most bag
reads are exactly those two shapes.

### 3.2 Mechanical annotation (32 errors, 25 files)

Two shapes:

- **`context.event` missing** (17 errors, 13 files) — the callback is inside a triggered
  ability, so annotate `(context: TriggeredAbilityContext) =>`. Files include
  `AkodoGunso`, `HidaAmoro` (3 sites), `RoadToShakyakuMura`, `LessonsFromEarth`,
  `IllusionaryTerrain`, `MirumotoRikitaro`, `IronMountainCastle`, `Subterfuge`,
  `MasterOfManyLifetimes`, `GanzuWarrior`, `TogashiGaijutsu`, `PublicForum`,
  `PrayersOnTheEveOfBattle`.
- **DrawCard-only member read off `BaseCard`** (15 errors, 12 files) — annotate the source
  type, e.g. `(context: AbilityContext<DrawCard>) =>`. Members involved: `getStrength`,
  `printedMilitarySkill`, `printedPoliticalSkill`, `getMilitarySkill`, `fate`, `glory`,
  `printedStrength`, `getCost`, `isParticipating`, `length`.

**Progress:** the `.event` shape is done except `RoadToShakyakuMura` and `IllusionaryTerrain`,
whose annotation exposes the bag (`costs.captureLocationCost`, `context.target`) and was
reverted until §3.1 is settled. Fixes were null-safe and checked against the printed text
(`test/json/Card/<id>.json`): `?.` / `?? []`, a winner/loser guard in `LessonsFromEarth` that
the trigger already guarantees, an `isProvinceCard` guard in `GanzuWarrior`, and removing
`PublicForum`'s dead `target: context.event` (`CancelAction` only forwards `target` as the
replacement's default target, and `addToken` sets its own). `MischievousTanuki` writes an ad-hoc
`context.fateTaken`; not done.

**Do not assume this bucket is free.** Annotating the 13 `.event` files cleared their 17
errors and immediately produced **24 new ones in the same 13 files** — `context.event.conflict`
possibly null, `context.source.attachedCharacter` possibly null, `loser` possibly undefined.
Annotation makes the context precise, which exposes the next layer. Budget for that.

**DrawCard-only bucket: done by annotation.** The repo owner chose annotating each callback
over the `_Target` lever (defaulting the context to the action's type argument, which is
rejected). 20 files: `(context: AbilityContext<DrawCard, DrawCard>) =>` (source, target), with
`ProvinceCard` / `StrongholdCard` where that is the source or target, and
`TriggeredAbilityContext` for a duel challenge (`BitingSteel`, which also drops its
`context as TriggeredAbilityContext` cast). Probe: 121 → 97.

**Trap: an explicit type argument blocks the annotation.** `cardLastingEffect<DrawCard>((context:
AbilityContext<DrawCard, DrawCard>) => ...)` fails under the probe: with `Target` given
explicitly, TypeScript does not infer `C`, so it falls back to `AbilityContext` and the annotated
callback is rejected. `Target` is phantom (`PropsFactory` ignores `_Target`), so drop it when
annotating: `cardLastingEffect((context: AbilityContext<DrawCard, DrawCard>) => ...)`.

Annotating exposes the next layer, as expected: `Unmask`'s `printedMilitarySkill` via `?.` became
`?? 0` (only undefined when there is no target, so nothing to apply to). A multi-select
`context.target` (`FuryOfTheDamned`, `TargetMode.Unlimited`) cannot be annotated, since `T extends
BaseCard`; it reads `context.targets.target as DrawCard[] | undefined` instead. `FieldOfRuin`
uses `parentProvince` (a Battlefield attachment is always on a province) and `?? []`.

### 3.3 Props object shape (60) and "other" (38)

Per-card work with no common lever. Representative:

- `KuniSilencer`-style predicates returning `Player | undefined` instead of `boolean`.
- `number | null` / `Conflict | null` passed where non-null is required.
- `BaseCard` passed where `DrawCard` is required (`KakitaKaezin`, `MirumotoRei`,
  `StrikeBeneathTheVeil`, `ExpertBartering`).
- `TS2769 No overload matches this call` (`TogashiYokuni`, `ImbuedWithShadows`, `IsawaTsuke2`).
- One stale `@ts-expect-error` in `IsawaTsuke2` (TS2578).

### 3.4 Callback variance (5)

`TwinSoulTemple`, `StormFromSakkaku`, `WiseQuartermaster`, `UseTheTerrain`, `UnderTheNewMoon`.
Method syntax (`foo?(x): boolean`) is bivariant; arrow syntax (`foo?: (x) => boolean`) is
strictly contravariant. Switching a property to method syntax is often the whole fix — this
is how `ThenAbility.thenCondition` was resolved at zero cost.

---

## 4. Already done (do not redo)

- **Null-safety bucket: cleared.** All 78 sites across 57 files. Optional chaining handled
  74 mechanically; 12 needed a real default or restructure
  (`(context.player.opponent?.hand.length ?? 0) - 4`, `duel.winner && conflictProvince ? ...`).
  Net was −66 not −78: optional chaining pushed 11 sites into the props-shape bucket as
  ordinary assignability errors instead of hidden nulls.
- **Attachment edge on `BaseCard`: `parent` / `parentCharacter` / `parentProvince`.** It went
  `parent`/`host` → `attachedTo`/`attachedCharacter`/`attachedProvince` and back to `parent*`
  at the co-developer's request. `parent: BaseCard | Ring | null` is the honest edge; the two
  getters narrow it. All `parentCharacter as DrawCard` casts are gone (they only stripped
  `null`); targets use `?? []`, which is what `GameAction.getProperties` turns `null` into.
- **Attachment plumbing hoisted** from `DrawCard`/`ProvinceCard` into `BaseCard`
  (`attachments`, `removeAttachment`, `attachmentHost`).
- **176 card files annotated** with context types where it was free to do so.
- `Player.opponent` and `Game.currentConflict` were checked for whether they could simply be
  made non-optional. **They cannot** — `opponent` is assigned from `game.getOtherPlayer(this)`
  and the engine guards it in ~10 places; `currentConflict` is genuinely `null` outside a
  conflict. Tightening either would be a lie.

---

## 5. Constraints (from the repo owner, non-negotiable)

- **No casts, except bag reads.** A prior refactor deliberately removed `as DrawCard` /
  `as Player` style assertions; do not reintroduce them to silence an error. The exception is
  reading `context.targets` / `context.costs` (§3.1), where a plain `as DrawCard` is accepted.
- **No `as unknown as` / double assertions.**
- **No `!` non-null assertions** — `@typescript-eslint/no-non-null-assertion` is `'error'`.
- **No `eslint-disable` of one rule to satisfy another.**
- **Never run git** — the repo owner handles all git operations.
- **Never run docker** — hand over the exact command instead.
- Keep comments terse and match the density of the surrounding file.

---

## 6. Traps found the hard way

1. **`any` hides renames.** Renaming `parent` → `attachedCharacter` passed `tsc` but broke
   two specs, because `ScoutsSteed` destructured it: `source: { parent: character }`. No dot,
   so a textual rename missed it, and the props-factory `any` meant the compiler could not
   see the property had ceased to exist. **This is the concrete cost of the remaining `any`.**
   Search for destructured bindings, not just `.member` access.
2. **Regexes under-match receivers.** `(x as DrawCard).parent`, `context?.source.parent` and
   `context.target?.parent` all slipped past a `((?:\w+\.)*\w+)\.parent` pattern. Verify with
   a full-tree grep after any mechanical rename.
3. **"Flip everything, let the compiler pull back" over-applies.** Flipping every `.parent`
   to `.host` and reverting only what failed to compile left ~100 files saying `host` while
   meaning `parent`, because `controller`/`location`/`===` exist on both types. Decide by
   semantics, not by what happens to error.
4. **The suite is the real oracle.** Several changes typechecked cleanly and broke 72 specs.
   Always run the full `npm test`, not a subset.
5. **Restore `GameActions.ts` before committing.** The probe edit is not meant to land until
   the count is 0.

---

## 7. Two cards rebuilt for their current printed text

Found while refreshing card data from emeralddb. Both were **full redesigns**, not tweaks —
the old implementations were for entirely different abilities. Both have now been rewritten.

Note: `test/json/Card` is gitignored and was deleted and refetched, so the previous text is
not recoverable and it is not knowable when upstream changed it. **It is worth auditing other
cards for the same drift** — these two were not subtly stale, they were the wrong card.

### 7.1 `daidoji-hiroteru` — done

> You may look at facedown cards in your provinces and may play each character in your
> provinces as if it were in your hand, even if it is facedown.
>
> **Reaction:** During the conflict phase, after you play a Scout or Shinobi character —
> that character gains covert until the end of the phase.

Rewritten. Two persistent effects (`canBeSeenWhenFacedown` on your facedown dynasty cards,
`gainPlayAction(PlayCharacterAsIfFromHand)` on characters in your provinces) plus the covert
reaction. The old dishonored gating, cost reduction and `+1/+1` action are gone.

**One engine change was needed.** `PutIntoPlayAction.canAffect` refuses a facedown card
(PutIntoPlayAction.ts:61), so "even if it is facedown" did not work. `PlayCharacterAsIfFromHand`
now turns the card face up as it is played:

```ts
// A card in hand is never facedown, and putIntoPlay refuses a facedown card, so a
// card played out of a province this way is turned face up as it is played.
public executeHandler(context: AbilityContext<DrawCard> & { chooseFate: number }): void {
    context.source.facedown = false;
    super.executeHandler(context);
}
```

This is shared with `GatewayToMeido`, `HiddenMoonDojo`, `ToSowTheEarth`, `ToConnectThePeople`,
`UtakuTakeko` and `AshalanLantern`; for those the card is already face up, so it is a no-op.
`DynastyCardAction` still refuses facedown cards, which is what stops the ordinary
play-from-province path being offered instead.

`DaidojiHiroteru.spec.js` rewritten from scratch: 13 specs covering both halves.

### 7.2 `strange-mirror` — done

> **Reaction:** After an opponent plays an event — put that event under attached character
> facedown.
>
> **Action:** Choose a facedown event underneath attached character — play that event as if
> it were in your hand. Then either sacrifice this attachment or injure attached character.

Rewritten. The old "put a copy of a character into play" implementation is gone, as is its
test block in `test/server/cards/22-SoD/Unicorn.spec.js` (51 lines, testing the old ability).
New spec at `test/server/cards/22-SoD/Unicorn/StrangeMirror.spec.js`, 7 specs.

Three things that were not obvious:

1. **An event is `'being played'` until it fully resolves and cannot be moved then.** The
   reaction gates on `event.card.location === Location.ConflictDiscardPile`, the same guard
   `DragonTattoo` uses.
2. **Do not pass `target` to an action nested inside `selectCard`.** The selected card is
   supplied as the default target; passing `target: context.target` from the enclosing
   context shadows it with `undefined`, and the nested action then silently does nothing —
   `playCard` was never even reaching `canAffect`.
3. **A replayed event returns to its owner's discard pile, not the pile of whoever played
   it.** `PlayCardAction.moveEventCardToDiscard` moves via `context.player`, so the card
   would land in the wrong player's pile; a `postHandler` re-homes it through `card.owner`.

Also worth knowing: `placeCardUnderneath` moves the card to the host's uuid but does **not**
register it in `childCards`, so anything reading "underneath" filters by location — that is
what `eventsUnderneath()` does.

Intended behaviour, confirmed by the repo owner: the events sit under the *attached character*,
per the card text, so if Strange Mirror leaves play they stay under the character and become
unreachable. Do not "fix" this by moving them under the mirror.
