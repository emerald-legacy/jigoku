# Jigoku Game Framework — Developer Reference

## Card Class Hierarchy

```
BaseCard
├── DrawCard          — conflict and dynasty cards
└── ProvinceCard      — province cards
```

Cards are defined in `server/game/cards/<set>/` as TypeScript classes extending the appropriate base. `setupCardAbilities()` is the entry point for registering all abilities.

---

## Ability Types

| Method | When it fires |
|--------|--------------|
| `this.action(...)` | Active player chooses to trigger |
| `this.reaction(...)` | Triggered after an event |
| `this.interrupt(...)` | Triggered before an event resolves |
| `this.wouldInterrupt(...)` | Triggered when an event would happen (can cancel) |
| `this.persistentEffect(...)` | Always active while conditions are met |
| `this.whileAttached(...)` | Persistent effect while this card is attached |

---

## The Context Object

Available in all callbacks (`condition`, `cardCondition`, `gameAction`, etc.):

| Path | What it is |
|------|-----------|
| `context.source` | The card the ability belongs to |
| `context.player` | The player activating the ability |
| `context.game` | The game object (shortcut for `context.source.game`) |
| `context.target` | The selected target (single-target actions) |
| `context.targets.name` | Named targets (multi-target actions) |
| `context.costs.name` | Paid costs |
| `context.event` | The triggering event (reactions/interrupts) |

### `this` vs `context.source`

**Rule: In DSL callbacks, use `context.source` for card properties, not `this`.**

```typescript
// WRONG
condition: () => this.bowed,
cardCondition: (card) => card.militarySkill >= this.militarySkill,

// CORRECT
condition: (context) => context.source.bowed,
cardCondition: (card, context) => card.militarySkill >= context.source.militarySkill,
```

**`this` is only acceptable for helper methods defined within the same file:**

```typescript
// OK — getNumberOfLegalTargets is defined in this file
cost: AbilityDsl.costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context)),
```

**Use `context.game` as a shortcut** instead of `context.source.game`:

```typescript
condition: (context) => context.game.isDuringConflict(),   // correct
condition: () => this.game.isDuringConflict(),              // avoid
```

**Exception — `when:` reaction callbacks** pass `event`, not `context`, so `context.source` is unavailable. Use the event properties directly:

```typescript
when: {
    onInitiateAbilityEffects: (event) => event.card.type === CardTypes.Event
}
```

---

## Province Cards

### Conflict Action vs persistentEffect

Province card Conflict Actions **do not need** `condition: () => this.isConflictProvince()`. The engine's `checkProvinceCondition` already enforces this — it returns false if the province is not currently under attack, and no action fires.

```typescript
// WRONG — redundant condition
this.action({
    title: 'Gain 1 fate',
    condition: () => this.isConflictProvince(),   // unnecessary
    gameAction: AbilityDsl.actions.gainFate()
});

// CORRECT
this.action({
    title: 'Gain 1 fate',
    gameAction: AbilityDsl.actions.gainFate()
});
```

**`persistentEffect` DOES need the condition** — it has no built-in province check. Use `context.source`:

```typescript
// CORRECT
this.persistentEffect({
    condition: (context) => context.source.isConflictProvince(),
    effect: AbilityDsl.effects.changeConflictSkillFunction((card) => card.getGlory())
});
```

### Additional conditions on Conflict Actions

Only non-province conditions go in `condition:`:

```typescript
// RiotInTheStreets — isConflictProvince() already enforced by engine
this.action({
    condition: (context) =>
        context.player.getNumberOfCardsInPlay((card) => card.hasTrait('bushi') && card.isParticipating()) >= 3,
    ...
});
```

### `isDuringConflict()` is redundant with conflict movement actions

`moveToConflict`, `putIntoConflict`, and `moveFromConflict` internally require a conflict to be active. Adding `condition: () => isDuringConflict()` on an action whose sole gate is the movement action is redundant — omit it.

```typescript
// WRONG — condition is redundant
this.action({
    title: 'Move this character into the conflict',
    condition: () => this.game.isDuringConflict(),
    gameAction: ability.actions.moveToConflict(...)
});

// CORRECT
this.action({
    title: 'Move this character into the conflict',
    gameAction: ability.actions.moveToConflict(...)
});
```

Keep the condition when it serves a distinct purpose beyond the presence of a conflict (e.g. conflict type, player state, card counts):

```typescript
// OK — checks military conflict type, which moveToConflict does not enforce
condition: (context) => context.game.isDuringConflict('military'),

// OK — also checks an additional player state
condition: (context) =>
    context.game.isDuringConflict() && context.player.isDefendingPlayer(),
```

**Note for `reaction.when`:** `isDuringConflict()` inside a `when:` clause is NOT redundant — it gates when the reaction fires, which is separate from the action's execution. Leave it as-is.

### `sendHome` / `moveToConflict` enforce participation internally

`sendHome.canAffect` already checks `card.isParticipating()`. `moveToConflict.canAffect` already checks `!card.isParticipating()`. Any `cardCondition` that duplicates exactly those checks is redundant:

```typescript
// WRONG — isParticipating already enforced by sendHome.canAffect
target: {
    cardCondition: card => card.isParticipating(),
    gameAction: AbilityDsl.actions.sendHome()
}

// WRONG — !isParticipating already enforced by moveToConflict.canAffect
target: {
    cardCondition: card => !card.isParticipating(),
    gameAction: AbilityDsl.actions.moveToConflict()
}
```

**Exception — multi-target selection:** In a two-target pattern where one target selects the card (no direct `gameAction`) and the other's gameAction references it via `context.targets.X`, the first target has no gameAction to enforce the check. Its `cardCondition: card => card.isParticipating()` is NOT redundant — it is the only filter.

Compound conditions keep the non-redundant part:
```typescript
// OK — printedCost check is still needed; !isParticipating() removed
cardCondition: (card) => card.printedCost <= 2,  // was: !isParticipating() && printedCost <= 2
gameAction: AbilityDsl.actions.moveToConflict()
```

### `isParticipating()` in any cardCondition implies conflict

If a target's `cardCondition` requires `card.isParticipating()` (for any gameAction — not just movement), no card can satisfy it when there is no conflict. A separate `condition: isDuringConflict()` is therefore redundant.

```typescript
// WRONG — isParticipating() in cardCondition already implies conflict
this.action({
    condition: (context) => context.game.isDuringConflict(),
    target: {
        cardCondition: card => card.isParticipating(),
        gameAction: AbilityDsl.actions.dishonor()
    }
});

// CORRECT
this.action({
    target: {
        cardCondition: card => card.isParticipating(),
        gameAction: AbilityDsl.actions.dishonor()
    }
});
```

The same applies when `condition:` uses `anyCardsInPlay(card => card.isParticipating() && ...)` — if any participating card exists, a conflict is ongoing.

**Keep** `isDuringConflict(ConflictType)` even alongside `isParticipating()` — it adds a type restriction (`'military'` / `'political'`) that participation does not enforce.

### `isAttacking()` / `isDefending()` imply a conflict exists

`card.isAttacking()` calls `currentConflict?.isAttacking(card)` — returns false when there is no current conflict. Same for `isDefending()`. Therefore, a `condition: isDuringConflict()` whose only purpose is to guard the action when there's no conflict is redundant if every target's `cardCondition` already requires `isAttacking()` or `isDefending()`:

```typescript
// WRONG — isDuringConflict() is redundant: isAttacking() already returns false when no conflict
this.action({
    condition: () => this.game.isDuringConflict(),
    target: {
        cardCondition: (card) => card.isAttacking(),
        gameAction: ability.actions.bow()
    }
});

// CORRECT
this.action({
    target: {
        cardCondition: (card) => card.isAttacking(),
        gameAction: ability.actions.bow()
    }
});
```

**Exceptions — keep `isDuringConflict()` when:**
- The condition checks a specific conflict **type**: `isDuringConflict('military')` — `isAttacking()` with no type arg does not enforce this
- The condition guards a direct null access: `this.game.isDuringConflict() && this.game.currentConflict.getSomeValue()` — removing it would cause a null-ref crash
- There is no `cardCondition` on the target (computed targets like `cardsInPlay.filter(...)`) — the action-level condition is the only UX gate preventing wasted cost payment outside of conflicts

### `conflictProvinceCondition`

Override which conflict provinces allow the action:

```typescript
// BrothersGiftDojo — fires during any conflict, not just when this province is attacked
this.action({
    conflictProvinceCondition: () => true,
    ...
});

// ShrugOffDespair — fires when this province is NOT being attacked
this.action({
    conflictProvinceCondition: () => true,
    condition: (context) => context.game.isDuringConflict() && !context.source.isConflictProvince(),
    ...
});
```

### Keeper of Secret Names interaction

`resolveAbility` with `ignoredRequirements: ['province']` bypasses `checkProvinceCondition`, allowing Keeper to trigger any province's action. This is why province action `condition:` must NOT contain `isConflictProvince()` — if it did, Keeper would be blocked by the condition even with the province check bypassed.

---

## Action Structure

```typescript
this.action({
    title: 'Human-readable title',

    // Optional — extra requirement beyond engine checks
    condition: (context) => context.game.isDuringConflict(),

    // Single target
    target: {
        cardType: CardTypes.Character,
        controller: Players.Self,               // whose cards are selectable
        player: Players.Self,                   // who makes the selection
        location: Locations.PlayArea,           // filter by location
        cardCondition: (card, context) => card.isParticipating(),
        gameAction: AbilityDsl.actions.bow()
    },

    // Chat message — see "Effect Formatting" section
    effect: 'bow {0}',

    // Cost
    cost: AbilityDsl.costs.payHonor(1),

    // Usage limits
    limit: AbilityDsl.limit.perConflict(1),
    max: AbilityDsl.limit.perRound(1),
});
```

### Multiple Targets

```typescript
this.action({
    targets: {
        first: {
            cardType: CardTypes.Character,
            cardCondition: (card) => card.isParticipating()
        },
        second: {
            dependsOn: 'first',
            cardType: CardTypes.Character,
            cardCondition: (card, context) => card !== context.targets.first
        }
    }
});
```

### Select Menu (TargetModes.Select)

Use when the card text says "Select one —":

```typescript
target: {
    mode: TargetModes.Select,
    choices: {
        'Move into conflict': AbilityDsl.actions.moveToConflict(context => ({ target: context.source })),
        'Move home': AbilityDsl.actions.sendHome(context => ({ target: context.source }))
    }
}
```

Do **not** use `conditional` gameAction as a substitute — that silently auto-executes without prompting the player.

#### SELECT prompt behavior

`AbilityTargetSelect` resolves in two stages:

- **`Stages.PreTarget`** (early target resolution, before costs): "Pay costs first" and "Cancel" are **always** appended. Even with only one legal choice, a prompt is shown (minimum two handlers). Auto-fire never occurs at this stage.
- **`Stages.Target`** (after costs paid): no extra buttons added. If exactly **one** legal choice remains, it auto-fires without a prompt.

Consequence for tests: actions with `TargetModes.Select` always show a prompt when triggered. Tests must call `this.playerN.clickPrompt('Choice text')` to handle it before asserting subsequent state.

```javascript
// WRONG — juro's SELECT always prompts; juro never actually moves
this.player1.clickCard(juro);
expect(this.juro.isParticipating()).toBe(true); // fails

// CORRECT
this.player1.clickCard(juro);
this.player1.clickPrompt('Move into conflict');
expect(this.juro.isParticipating()).toBe(true); // passes
```

---

## Effect Formatting

Chat messages use numbered placeholders `{0}`, `{1}`, etc. The game engine applies special formatting to game objects and reserved keywords.

### Rules

1. **Never interpolate game objects** (cards, players) into the effect string using template literals or string concatenation.
2. **Never interpolate the words `military` or `political`** — the engine formats these specially.
3. Pass game objects as separate entries in `effectArgs` and reference via `{N}`.

`{0}` is the implicit primary target. `{1}`, `{2}`, ... come from `effectArgs`.

```typescript
// WRONG — interpolates player name
effect: `place it on top of ${context.event.card.owner.name}'s conflict deck`,

// WRONG — interpolates game object
effectArgs: (context) => [`moved ${context.target.name} home`],

// CORRECT — game objects as separate args
effect: 'place a fate from {1}\'s fate pool on {0}',
effectArgs: (context) => [context.target.controller],

// CORRECT — conditional plain text (no game objects involved)
effect: 'cancel the effects of {1} and {2}',
effectArgs: (context) => [
    context.event.card,
    context.event.card.isConflict
        ? 'return it to the top of its owner\'s conflict deck'
        : 'move it to its owner\'s dynasty discard pile'
],
```

---

## Duel System

### `initiateDuel` (preferred)

For cards that initiate a duel, use the `initiateDuel` property directly on the action:

```typescript
this.action({
    title: 'Initiate a military duel',
    initiateDuel: {
        type: DuelTypes.Military,
        gameAction: (duel) => AbilityDsl.actions.discardFromPlay({ target: duel.loser })
    }
});
```

**Available options in `initiateDuel`:**

| Option | Default | Description |
|--------|---------|-------------|
| `type` | required | `DuelTypes.Military` or `DuelTypes.Political` |
| `gameAction` | none | `(duel) => GameAction` — effect on resolution |
| `message` | default | Chat message template |
| `messageArgs` | none | `(duel) => [...]` — args for message |
| `requiresConflict` | `true` | Whether challenger and target must be participating |
| `challengerCondition` | `isParticipating()` | Extra condition on challenger |
| `targetCondition` | `isParticipating()` | Extra condition on duelTarget |
| `opponentChoosesDuelTarget` | `false` | Opponent selects their own character |
| `opponentChoosesChallenger` | `false` | Opponent selects the challenger |
| `refuseGameAction` | none | Effect if opponent refuses duel |

**When the source card IS a Character** (`initiateDuelFromCharacter`): the source card is automatically the challenger. No target selection for challenger.

**When the source card is NOT a Character** (`initiateDuelFromOther`): the card user selects a challenger from their own characters (`controller: Players.Self`), then selects a duelTarget from the opponent's characters (`controller: Players.Opponent`).

### `requiresConflict` and redundant conditions

`requiresConflict` defaults to `true` in `DuelHelper`. When true, both the challenger and the duel target must satisfy `card.isParticipating()`. Since no card can be participating without an active conflict, this makes `isDuringConflict()` and `condition: context => context.source.isParticipating()` redundant on cards that use `initiateDuel` with default settings:

```typescript
// WRONG — both conditions are redundant: requiresConflict:true already enforces participation
this.action({
    title: 'Initiate a duel',
    condition: (context) => context.game.isDuringConflict(),   // redundant
    initiateDuel: { type: DuelTypes.Military, ... }
});

this.action({
    title: 'Initiate a duel',
    condition: (context) => context.source.isParticipating(),  // redundant
    initiateDuel: { type: DuelTypes.Military, ... }
});

// CORRECT
this.action({
    title: 'Initiate a duel',
    initiateDuel: { type: DuelTypes.Military, ... }
});
```

**Keep** `isDuringConflict(ConflictType)` — it restricts to a specific conflict type that `requiresConflict` does not enforce:

```typescript
// OK — 'military' type restriction is not enforced by requiresConflict
condition: (context) => context.game.isDuringConflict(ConflictTypes.Military),
initiateDuel: { type: DuelTypes.Military, ... }
```

**Custom `challengerCondition` bypasses the default participation check for the challenger.** If the custom condition does not check `isParticipating()`, the challenger is not required to be in the conflict. However, the target still defaults to `isParticipating()`, so a conflict is still required for any legal target combination. `isDuringConflict()` on the action remains redundant.

**`requiresConflict: false`** explicitly opts out: challenger and target need not be participating. Use for out-of-conflict duels.

### `duel.winner` / `duel.loser`

Both are **arrays** (can be empty on a tie). Use `.length` checks in conditionals:

```typescript
messageArgs: (duel) => [
    duel.winner,
    duel.winner?.length ? ' does not bow as a result of conflict resolution' : '',
    duel.loser?.length ? ' and ' : '',
    duel.loser,
    duel.loser?.length ? ' cannot be readied' : ''
],
```

### When NOT to use `initiateDuel`

`initiateDuel` hardcodes `controller: Players.Self` for the challenger. If a card explicitly requires `Players.Any` or non-standard controller selection for the challenger, use raw `targets` + `AbilityDsl.actions.duel(...)` instead.

---

## GameActions

```typescript
AbilityDsl.actions.bow()
AbilityDsl.actions.bow((context) => ({ target: context.targets.something }))
AbilityDsl.actions.sendHome()
AbilityDsl.actions.moveToConflict()
AbilityDsl.actions.dishonor()
AbilityDsl.actions.honor()
AbilityDsl.actions.placeFate()
AbilityDsl.actions.removeFate()
AbilityDsl.actions.gainFate()
AbilityDsl.actions.loseFate()
AbilityDsl.actions.draw()
AbilityDsl.actions.discardFromPlay()
AbilityDsl.actions.reveal()
AbilityDsl.actions.cancel()
AbilityDsl.actions.moveCard((context) => ({ target: context.target, destination: Locations.ConflictDeck }))
AbilityDsl.actions.resolveRingEffect()
AbilityDsl.actions.switchConflictType()
AbilityDsl.actions.switchConflictElement()
AbilityDsl.actions.turnFacedown()
AbilityDsl.actions.moveConflict((context) => ({ target: context.source }))

// Apply multiple actions
AbilityDsl.actions.multiple([action1, action2])
// or as an array on a target
gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor()]

// Conditional action (silent — no player prompt)
AbilityDsl.actions.conditional({
    condition: (context) => context.target.isParticipating(),
    trueGameAction: AbilityDsl.actions.sendHome(),
    falseGameAction: AbilityDsl.actions.moveToConflict()
})

// Lasting effects
AbilityDsl.actions.cardLastingEffect((context) => ({
    target: context.target,
    duration: Durations.UntilEndOfConflict,
    effect: AbilityDsl.effects.doesNotBow()
}))

AbilityDsl.actions.playerLastingEffect((context) => ({
    targetController: context.player,
    effect: AbilityDsl.effects.increaseCost({ amount: 1, match: (card) => card.type === CardTypes.Event })
}))

// Resolve another card's ability (used by Keeper of Secret Names)
AbilityDsl.actions.resolveAbility((context) => ({
    target: context.target,
    ability: context.target.abilities.actions[0],
    ignoredRequirements: ['province'],
    choosingPlayerOverride: context.choosingPlayerOverride
}))
```

### `ignoredRequirements` values

| Value | What it skips |
|-------|--------------|
| `'location'` | Location validity check |
| `'province'` | `checkProvinceCondition` (province must be conflict province) |
| `'phase'` | Phase restriction |
| `'player'` | Player/controller permission |
| `'condition'` | The ability's `condition:` function |
| `'cost'` | Cost payment |
| `'limit'` | Usage limit |
| `'triggeringRestrictions'` | Triggering restriction checks |

---

## Lasting Effects

```typescript
AbilityDsl.effects.doesNotBow()
AbilityDsl.effects.cardCannot({ cannot: 'ready', restricts: 'cardEffects' })
AbilityDsl.effects.cardCannot({ cannot: 'target', restricts: 'opponentsCardEffects' })
AbilityDsl.effects.cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
AbilityDsl.effects.modifyMilitarySkill(2)
AbilityDsl.effects.modifyPoliticalSkill(2)
AbilityDsl.effects.modifyBothSkills(1)
AbilityDsl.effects.increaseCost({ amount: 1, match: (card) => card.type === CardTypes.Event })
AbilityDsl.effects.gainAbility(AbilityTypes.Action, { ... })
AbilityDsl.effects.switchBaseSkills()
AbilityDsl.effects.cannotContribute(() => (card) => condition)
AbilityDsl.effects.changeConflictSkillFunction((card) => card.getGlory())
AbilityDsl.effects.playerCannot('spendFate')
AbilityDsl.effects.suppressEffects((effect) => condition)
AbilityDsl.effects.gainPlayAction(SomePlayClass)
AbilityDsl.effects.setApparentFate(0)
```

---

## Costs

```typescript
AbilityDsl.costs.payHonor(1)
AbilityDsl.costs.bowSelf()
AbilityDsl.costs.sacrifice(predicate)
AbilityDsl.costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context))
```

---

## Limits

```typescript
AbilityDsl.limit.perRound(1)
AbilityDsl.limit.perConflict(1)
AbilityDsl.limit.perPhase(1)
```

---

## Common Card Properties

```typescript
card.isParticipating()          // in current conflict
card.isAttacking()              // attacking in current conflict
card.isDefending()              // defending in current conflict
card.bowed                      // boolean
card.isHonored                  // boolean
card.isDishonored               // boolean
card.hasTrait('bushi')          // boolean
card.type                       // CardTypes.Character / Event / Attachment / Province
card.isDynasty                  // boolean (cardData.side === 'dynasty')
card.isConflict                 // boolean (cardData.side === 'conflict')
card.attachments                // array of attached cards
card.attachments.length
card.parent                     // parent card (for attachments)
card.controller                 // owner player
card.getMilitarySkill()
card.getPoliticalSkill()
card.getGlory()
card.location                   // Locations string
card.allowGameAction('bow', context)   // checks if action is permitted
```

---

## EventRegistrar Pattern

For cards that need to track events across turns (e.g., VengefulKami tracking which provinces have been attacked):

```typescript
import { EventRegistrar } from '../../EventRegistrar';
import { EventNames, AbilityTypes } from '../../Constants';

setupCardAbilities() {
    this.eventRegistrar = new EventRegistrar(this.game, this);

    // Reaction to event
    this.eventRegistrar.register([{
        [EventNames.OnConflictDeclared + ':' + AbilityTypes.Reaction]: 'onConflictDeclaredReaction'
    }]);

    // Simple event listener
    this.eventRegistrar.register([EventNames.OnRoundEnded]);
}

onRoundEnded() {
    this.trackedData = [];
}

onConflictDeclaredReaction(event) {
    // handle event
}
```

---

## `Players` and `player:` vs `controller:`

These are distinct and must not be confused:

| Property | Meaning |
|----------|---------|
| `player:` | WHO makes the selection (`Players.Self`, `Players.Opponent`) |
| `controller:` | WHOSE cards are available to select |

Example: opponent selects from their own discard pile:
```typescript
target: {
    player: Players.Opponent,        // opponent makes the selection
    location: Locations.ConflictDiscardPile,
    controller: Players.Opponent,    // only opponent's cards are selectable
    cardCondition: (card, context) => card.controller === context.player.opponent
}
```

---

## Reaction / Interrupt / wouldInterrupt

```typescript
this.reaction({
    when: {
        onCardEntersPlay: (event, context) => event.card === context.source
    },
    gameAction: AbilityDsl.actions.placeFate()
});

this.wouldInterrupt({
    title: 'Cancel an event',
    when: {
        onInitiateAbilityEffects: (event) => event.card.type === CardTypes.Event
    },
    cannotBeMirrored: true,
    gameAction: AbilityDsl.actions.multiple([
        AbilityDsl.actions.cancel(),
        AbilityDsl.actions.conditional({
            condition: (context) => context.event.card.isConflict,
            trueGameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.event.card,
                destination: Locations.ConflictDeck
            })),
            falseGameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.event.card,
                destination: Locations.DynastyDiscardPile
            }))
        })
    ]),
    effect: 'cancel the effects of {1} and {2}',
    effectArgs: (context) => [
        context.event.card,
        context.event.card.isConflict
            ? 'return it to the top of its owner\'s conflict deck'
            : 'move it to its owner\'s dynasty discard pile'
    ]
});
```

---

## Province Card Engine Internals

`CardAction.meetsRequirements()` checks in order:

1. **location** — card in valid location
2. **province** — `checkProvinceCondition()` (skippable with `ignoredRequirements: ['province']`)
3. **phase** — action valid for current phase
4. **player** — correct player
5. **condition** — custom `condition:` callback (skippable with `ignoredRequirements: ['condition']`)
6. **cost** — costs payable
7. **target** — valid targets exist

`checkProvinceCondition`:

```
card.type !== Province                   → passes (non-province cards always pass)
OR canTriggerOutsideConflict             → passes
OR conflictProvinceCondition(province)   → passes if this card matches current conflict provinces
```

Default `conflictProvinceCondition`: `province === this.card` (must be the exact province under attack).

---

## Ability Resolver Pipeline

When a card ability is triggered, `AbilityResolver` runs these steps in order:

1. `createSnapshot()` — snapshot source card state
2. `resolveEarlyTargets()` — resolve targets at `Stages.PreTarget` (before costs)
3. `checkForCancel()` — abort if player cancelled
4. `openInitiateAbilityEventWindow()` — fire `onCardAbilityInitiated` event
5. Inside: `resolveCosts()` → `payCosts()` → `checkCostsWerePaid()` → `resolveTargets()` (at `Stages.Target`) → `initiateAbilityEffects()` → `executeHandler()`
6. `refillProvinces()`

**Implication for reactions:** A reaction that triggers on `onCardAbilityInitiated` (step 4) fires **after** the initiating card's PreTarget prompt has been handled. If a card with a `TargetModes.Select` action fires, the SELECT prompt must be resolved by the player before the reaction's trigger window opens.

**`isTriggeredAbility()` returns `true` for all `CardAction` and `CardAbility` subclasses** (actions, reactions, interrupts). It returns `false` only on bare `BaseAbility`. This means reactions that filter on `event.ability.isTriggeredAbility()` will fire on opponent action abilities, not just on reaction/interrupt abilities.

---

## Key Constants

```typescript
import { CardTypes, Players, Locations, DuelTypes, TargetModes, AbilityTypes, Durations, EventNames, ConflictTypes, Elements } from '../../Constants';

CardTypes.Character / Event / Attachment / Province / Stronghold / Role / Holding

Players.Self / Opponent / Any

Locations.PlayArea / ConflictDiscardPile / DynastyDiscardPile / ConflictDeck / DynastyDeck / Provinces / Hand

DuelTypes.Military / Political

TargetModes.Select / Exactly / ExactlyVariable / Ring / MaxStar / Unlimited

AbilityTypes.Action / Reaction / Interrupt / ForcedInterrupt / ForcedReaction / WouldInterrupt

Durations.UntilEndOfConflict / UntilEndOfPhase / UntilEndOfRound / Persistent

ConflictTypes.Military / Political
```

---

## Common Patterns

### Province Conflict Action (simple)
```typescript
import { ProvinceCard } from '../../ProvinceCard';
import AbilityDsl from '../../abilitydsl';

export default class Example extends ProvinceCard {
    static id = 'example';

    setupCardAbilities() {
        this.action({
            title: 'Do something',
            // No condition needed — engine enforces "must be conflict province"
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
```

### Province persistentEffect (active while under attack)
```typescript
this.persistentEffect({
    condition: (context) => context.source.isConflictProvince(),
    effect: AbilityDsl.effects.changeConflictSkillFunction((card) => card.getGlory())
});
```

### Conflict Action (DrawCard, requires conflict)
```typescript
this.action({
    title: 'Bow a participating character',
    condition: (context) => context.game.isDuringConflict(),
    target: {
        cardType: CardTypes.Character,
        cardCondition: (card) => card.isParticipating(),
        gameAction: AbilityDsl.actions.bow()
    }
});
```

### Duel initiation (from DrawCard)
```typescript
this.action({
    title: 'Initiate a military duel',
    initiateDuel: {
        type: DuelTypes.Military,
        targetCondition: (card) => card.isParticipating() && !card.bowed,
        gameAction: (duel) => AbilityDsl.actions.discardFromPlay({ target: duel.loser }),
        message: 'discard {0}',
        messageArgs: (duel) => duel.loser
    }
});
```

### Duel initiation (from Character, self is challenger)
```typescript
this.action({
    title: 'Initiate a duel',
    initiateDuel: {
        type: DuelTypes.Political,
        // source card is automatically the challenger
        opponentChoosesDuelTarget: true,
        gameAction: (duel) => AbilityDsl.actions.bow({ target: duel.loser })
    }
});
```
