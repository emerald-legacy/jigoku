# Ability DSL Reference

This document describes the ability DSL used to implement card effects. All APIs live under `AbilityDsl`, which is imported from `server/game/abilitydsl.ts`.

```typescript
import AbilityDsl from '../../abilitydsl';
```

`AbilityDsl` has four namespaces:

| Namespace | Purpose |
|-----------|---------|
| `AbilityDsl.actions` | Game actions (bow, honor, discard, move, etc.) |
| `AbilityDsl.effects` | Effect factories for lasting/persistent effects |
| `AbilityDsl.costs` | Cost functions |
| `AbilityDsl.limit` | Limit constructors |

---

## Card Class Structure

Every card extends `DrawCard` (characters, attachments, events) or `ProvinceCard`. Abilities are registered in `setupCardAbilities()`.

```typescript
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';
import { CardTypes, Players } from '../../Constants';

export default class MyCard extends DrawCard {
    static id = 'my-card';

    setupCardAbilities() {
        this.action({ ... });
        this.reaction({ ... });
        this.interrupt({ ... });
        this.persistentEffect({ ... });
    }
}
```

---

## Ability Types

### `this.action(props: ActionProps)`

Player-triggered ability usable during action windows.

```typescript
this.action({
    title: 'Bow a character',
    phase: Phases.Conflict,            // restrict to a phase (default: 'conflict')
    condition: (context) => context.source.isParticipating(),
    cost: AbilityDsl.costs.bowSelf(),
    target: {
        cardType: CardTypes.Character,
        cardCondition: (card) => card.isParticipating(),
        gameAction: AbilityDsl.actions.bow()
    },
    limit: AbilityDsl.limit.perConflict(1),
    effect: 'bow {0}',
    effectArgs: (context) => [context.targets.target]
});
```

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Button label shown to player |
| `phase` | `Phases \| 'any'` | Phase restriction. Default `'any'`. During the Dynasty phase, only Holding/Character/Attachment cards (or `evenDuringDynasty: true`, or events allowed by `dynastyPhaseCanPlayConflictEvents`) may trigger |
| `evenDuringDynasty` | `boolean` | Allow triggering during the Dynasty phase without the default per-type restrictions |
| `anyPlayer` | `boolean` | Either player may trigger (default `false`) |
| `canTriggerOutsideConflict` | `boolean` | Province actions can fire when no conflict is active |
| `conflictProvinceCondition` | `(province, context) => bool` | Which conflict provinces allow the action (default: `province === this.card`) |
| `condition` | `(context) => boolean` | Extra boolean gate — ability only appears if this returns `true` |
| `cost` | `Cost \| Cost[]` | Costs to pay before resolving (see [Costs](#costs)) |
| `target` / `targets` | see [Targets](#targets) | Card/ring/select targets |
| `gameAction` | `GameAction \| GameAction[]` | Action(s) to resolve (see [Game Actions](#game-actions)) |
| `limit` | `AbilityLimit` | Usage limit (see [Limits](#limits)) |
| `max` | `AbilityLimit` | Alias for `limit` |
| `effect` | `string` | Chat log message. `{0}` = source, `{1}` = first effectArg, etc. |
| `effectArgs` | `EffectArg \| (context) => EffectArg` | Arguments interpolated into `effect` |
| `handler` | `(context) => void` | Low-level handler called after costs are paid (use `gameAction` when possible) |
| `then` | `object \| (context) => object` | Chains a second ability after this one resolves |
| `cannotTargetFirst` | `boolean` | Skip PreTarget early-target resolution — targets are resolved only after costs (`Stages.Target`) |
| `initiateDuel` | `InitiateDuel \| (context) => InitiateDuel` | Sugar that wires a duel as the action's effect (see [Duels](#duels)) |

### `this.reaction(props: TriggeredAbilityProps)`

Reaction that fires after a triggering event. The player chooses whether to use it.

```typescript
this.reaction({
    title: 'Gain 1 honor',
    when: {
        onCharacterEntersPlay: (event, context) =>
            event.card.controller === context.player
    },
    gameAction: AbilityDsl.actions.gainHonor((context) => ({
        target: context.player
    })),
    limit: AbilityDsl.limit.perRound(1)
});
```

### `this.interrupt(props: TriggeredAbilityProps)`

Interrupt fires before the triggering event resolves. Useful for cancels and redirections.

```typescript
this.interrupt({
    title: 'Cancel an event',
    when: {
        onCardPlayed: (event, context) =>
            event.card.hasTrait('spell') && event.player !== context.player
    },
    gameAction: AbilityDsl.actions.cancel()
});
```

### Forced variants

`this.forcedReaction(props)` and `this.forcedInterrupt(props)` fire automatically — the player cannot opt out. Used for mandatory effects (e.g., "when X happens, you must Y").

### `this.wouldInterrupt(props)`

Fires "before" the triggering event is queued at all. Used for "would" effects — prevention or modification before the event happens. Rare.

The constant `AbilityTypes.WouldInterrupt` has the string value `'cancelinterrupt'` for historical reasons.

### Duel-window helpers

`this.duelChallenge(props)`, `this.duelFocus(props)`, `this.duelStrike(props)` are sugar that wire the `when:` clause to the corresponding duel-step event. They accept `duelCondition: (duel, context) => boolean` instead of a raw `when:` map.

### `when:` and `aggregateWhen:`

Triggered abilities accept either `when:` (checks individual events) or `aggregateWhen:` (checks all events in a window at once).

`when:` is a map from `EventNames` to a predicate:

```typescript
when: {
    onCardLeavesPlay: (event, context) => event.card === context.source,
    onCardBowed:      (event, context) => event.card.controller === context.player
}
```

Multiple keys in `when:` are OR'd — the ability triggers if any key matches. The `event` parameter can be typed with `EventPayload<EventNames.X>` — see [Typed Targets & Events](#typed-targets--events-typescript).

`aggregateWhen` receives all events:

```typescript
aggregateWhen: (events, context) =>
    events.some(e => e.name === EventNames.OnCardBowed && e.card.isParticipating())
```

### `this.persistentEffect(props: PersistentEffectProps)`

A continuous effect active while the card is in play (or in the specified `location`).

```typescript
this.persistentEffect({
    condition: (context) => context.source.isParticipating(),
    match: (card) => card.hasTrait('cavalry'),
    effect: AbilityDsl.effects.modifyMilitarySkill(2)
});
```

| Field | Description |
|-------|-------------|
| `location` | Where the source must be for the effect to be active. Default: `Locations.PlayArea` |
| `condition` | Dynamic gate — re-evaluated each action/event window |
| `match` | Which cards are affected. Omit to target the source card itself |
| `targetController` | `Players.Self`, `Players.Opponent`, `Players.Any` |
| `targetLocation` | Where the affected cards must be |
| `effect` | One or more effect factory results from `AbilityDsl.effects` |

### `this.composure(props)`

Sugar for `persistentEffect` with `condition: context.player.hasComposure()`. Active while the controller has composure.

```typescript
this.composure({
    effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, { ... })
});
```

### `this.dire(props)`

Sugar for `persistentEffect` with `condition: context.source.isDire()`. Active while the card is dire (has no fate).

### `this.attachmentConditions(props: AttachmentConditionProps)`

Declares attachment restrictions. Should be called from `setupCardAbilities()` on attachment cards.

```typescript
this.attachmentConditions({
    myControl: true,              // can only attach to cards the controller controls
    opponentControlOnly: true,    // (or) can only attach to opponent's cards
    trait: 'bushi',               // must attach to a bushi
    faction: ['crane', 'lion'],   // or restrict to a faction
    unique: true,                 // card is unique attachment-wise
    limit: 1,                     // max N copies of this attachment on a single card
    limitTrait: { weapon: 2 },    // max 2 weapons on the attached card
    cardCondition: (card) => true // arbitrary extra filter on the parent
});
```

---

## Targets

Targets are declared under `target:` (single target) or `targets:` (named multi-target). Multi-target keys can use `dependsOn: 'prevTargetName'` to make one target depend on another.

### Single card target (default `mode: TargetModes.Single`)

```typescript
target: {
    cardType: CardTypes.Character,      // filter by type
    controller: Players.Opponent,       // whose cards
    location: Locations.PlayArea,       // where the card must be
    cardCondition: (card, context) => card.isParticipating(),  // card: BaseCard — narrow if needed
    gameAction: AbilityDsl.actions.bow()
}
```

### Multiple cards (`TargetModes.UpTo` / `TargetModes.Exactly`)

```typescript
target: {
    mode: TargetModes.UpTo,
    numCards: 3,
    cardType: CardTypes.Character,
    gameAction: AbilityDsl.actions.bow()
}
```

| Mode | Behavior |
|------|----------|
| `Single` | Default — choose exactly 1 card |
| `UpTo` | Choose 0–N cards |
| `Exactly` | Must choose exactly N cards |
| `UpToVariable` | `numCardsFunc: (context) => n` |
| `ExactlyVariable` | Same, but must choose exactly that many |
| `MaxStat` | Choose up to N cards whose combined stat ≤ max |
| `Unlimited` | Choose any number |

### Ring target

```typescript
target: {
    mode: TargetModes.Ring,
    ringCondition: (ring, context) => ring.isUnclaimed(),
    gameAction: AbilityDsl.actions.claimRing()
}
```

### Select target (prompt with labeled choices)

```typescript
target: {
    mode: TargetModes.Select,
    choices: {
        'Bow': AbilityDsl.actions.bow((context) => ({ target: context.targets.someCard })),
        'Honor': AbilityDsl.actions.honor((context) => ({ target: context.targets.someCard }))
    }
}
```

The choices object maps button labels to `GameAction`s (or a `(context) => boolean` condition). A choice is shown only if its action has a legal target or its condition returns `true`.

### Named multi-targets

```typescript
targets: {
    attacker: {
        cardType: CardTypes.Character,
        cardCondition: (card) => card.isAttacking()
    },
    attachment: {
        dependsOn: 'attacker',
        cardType: CardTypes.Attachment,
        cardCondition: (card, context) => card.parent === context.targets.attacker,
        gameAction: AbilityDsl.actions.detach()
    }
}
```

---

## Typed Targets & Events (TypeScript)

The ability methods are generic over the target card type, so card code can read `context.target` with a concrete type instead of casting.

### Typing the target

`this.action`, `this.reaction`, `this.interrupt`, `this.forcedReaction`, `this.forcedInterrupt`, and `this.wouldInterrupt` all take a `<Target extends BaseCard>` parameter (default `BaseCard`). Pass the type your `target:` selects and `context.target` is typed to it:

```typescript
this.action<DrawCard>({
    target: {
        cardType: CardTypes.Character,
        gameAction: AbilityDsl.actions.bow()
    },
    effect: 'bow {0}',
    handler: (context) => {
        // context.target: DrawCard | undefined — no cast needed
        if(!context.target) {
            return;
        }
        context.target.bow();
    }
});
```

Use `<ProvinceCard>` for province-targeting abilities. The default `BaseCard` covers cards that don't read `context.target` (or read it only as a `BaseCard`).

Notes:

- `context.target` is `Target | undefined`. Always guard (`if(!context.target) return;`) — `no-non-null-assertion` is an error, so never write `context.target!`.
- Multi-card target modes (`Exactly`/`Unlimited` with `numCards > 1`) assign an array. Those cards read `context.targets.target as DrawCard[]`, or use the typed helper `context.getCards<DrawCard>()` (defaults to the `'target'` name), instead of `context.target`.
- `cardCondition: (card, context) => …` receives `card: BaseCard`. Narrow with `instanceof DrawCard`, the `isProvinceCard(card)` type predicate (from `ProvinceCard.ts`), or an `as DrawCard` cast when you need subtype-only members.
- `AbilityContext<S, T>` carries the generic — `S` is the source type, `T` the target type. Most card code never names it explicitly; the `this.action<T>()` form sets `T` for you.

### Typed `when:` events

Inside a `when:` predicate (or `aggregateWhen`), the event is typed. Annotate the parameter with `EventPayload<EventNames.X>` to read its payload fields with full typing:

```typescript
import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

this.reaction<DrawCard>({
    when: {
        afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: TriggeredAbilityContext) =>
            event.conflict.loser === context.player && context.source.isAttacking()
    },
    // ...
});
```

In a handler, `context.event` is typed too — `context.event.conflict`, `context.event.card`, etc. resolve to typed unions rather than `any`. Narrow on `context.event.name` when you need a field specific to one event.

---

## Costs

Costs are imported from `AbilityDsl.costs`. Multiple costs can be combined as an array.

### Self-targeting costs

| Function | Effect |
|----------|--------|
| `costs.bowSelf()` | Bows the source card |
| `costs.bowParent()` | Bows the parent (for attachments) |
| `costs.sacrificeSelf()` | Sacrifices the source |
| `costs.discardSelf()` | Discards the source from hand |
| `costs.returnSelfToHand()` | Returns source to hand |
| `costs.removeSelfFromGame()` | Removes source from game |
| `costs.dishonorSelf()` | Dishonors the source |
| `costs.discardStatusTokenFromSelf()` | Discards honored token from source |
| `costs.taintSelf()` | Taints the source |
| `costs.breakSelf()` | Breaks the source province |
| `costs.putSelfIntoPlay()` | Puts source into play |
| `costs.moveHomeSelf()` | Sends source home |
| `costs.removeFateFromSelf()` | Removes 1 fate from source |
| `costs.removeFateFromParent()` | Removes 1 fate from parent attachment |
| `costs.switchLocation()` | Moves source home↔conflict depending on current location |

### Resource costs

| Function | Description |
|----------|-------------|
| `costs.payFate(n)` | Pay N fate (default 1). Can be a function `(context) => n` |
| `costs.payHonor(n)` | Pay N honor (default 1) |
| `costs.payPrintedFateCost()` | Pay card's printed cost |
| `costs.payReduceableFateCost()` | Pay printed cost with cost reducers applied |
| `costs.giveHonorToOpponent(n)` | Transfer N honor to opponent (default 1) |
| `costs.giveFateToOpponent(n)` | Transfer N fate to opponent (default 1) |
| `costs.payFateToRing(n, condition)` | Place N fate on an unclaimed ring (player picks) |
| `costs.optionalFateCost(n)` | Prompt to optionally pay N fate |
| `costs.optionalGiveFateCost(n)` | Prompt to optionally give N fate to opponent |
| `costs.variableFateCost({ maxAmount, ... })` | Prompt to pay a variable amount of fate |
| `costs.variableHonorCost(amountFunc)` | Prompt to pay a variable amount of honor |

### Selection costs (require choosing a card)

These prompt the player to pick a card, then perform the action as the cost.

| Function | Description |
|----------|-------------|
| `costs.bow(props)` | Bow a selected card |
| `costs.sacrifice(props)` | Sacrifice a selected card |
| `costs.returnToHand(props)` | Return a selected card to hand |
| `costs.returnToDeck(props)` | Return a selected card to deck |
| `costs.discardCard(props)` | Discard a selected card from hand |
| `costs.dishonor(props)` | Dishonor a selected character |
| `costs.removeFate(props)` | Remove a fate from a selected card |
| `costs.removeFromGame(props)` | Remove a selected card from game |
| `costs.taint(props)` | Taint a selected card |
| `costs.breakProvince(props)` | Break a selected province |
| `costs.discardStatusToken(props)` | Discard the honored token from a selected character |
| `costs.moveToConflict(props)` | Move a selected character to conflict |
| `costs.shuffleIntoDeck(props)` | Shuffle a selected card into the dynasty deck |
| `costs.reveal(cardFunc)` | Reveal specific cards |
| `costs.selectedReveal(props)` | Reveal a player-selected card |
| `costs.discardCardsUpToVariableX(n)` | Discard up to N cards from hand |
| `costs.discardCardsExactlyVariableX(n)` | Discard exactly N cards from hand |
| `costs.discardHand()` | Discard entire hand |
| `costs.dishonorAndSacrifice(props)` | Dishonor and sacrifice a selected card |

### Special costs

| Function | Description |
|----------|-------------|
| `costs.nameCard()` | Prompt to name any card (used for Calling the Moon's Name etc.) |
| `costs.returnRings(amount, condition)` | Return one or more claimed rings |
| `costs.discardTopCardsFromDeck({ amount, deck })` | Discard N cards from top of a deck |
| `costs.optional(cost)` | Wraps any cost to make it optional (Yes/No prompt) |
| `costs.optionalOpponentLoseHonor(prompt)` | Opponent is asked to lose 1 honor |
| `costs.discardImperialFavor()` | Discard the Imperial Favor |
| `costs.chooseFate(playType)` | Standard "how much extra fate" prompt for playing characters |

The `props` parameter for selection costs takes the same properties as `target:` on an ability (e.g., `cardType`, `controller`, `cardCondition`, `location`, `mode`, `numCards`).

---

## Limits

Limits track how many times an ability can be used per time period.

| Function | Resets when |
|----------|-------------|
| `limit.fixed(n)` | Never resets — N uses total per game |
| `limit.perGame(n)` | Never resets — alias for `fixed` with explicit name |
| `limit.perRound(n)` | Each round ends |
| `limit.perConflict(n)` | Each conflict ends |
| `limit.perConflictOpportunity(n)` | Conflict ends or player passes a conflict |
| `limit.perPhase(n)` | Each phase ends |
| `limit.perDuel(n)` | Each duel ends |
| `limit.unlimitedPerConflict()` | Each conflict ends (unlimited uses within) |
| `limit.unlimited()` | Never at max — truly unlimited |
| `limit.repeatable(n, eventName)` | On a specific `EventNames` |

Both `limit:` and `max:` on an ability accept a limit object. They are equivalent.

---

## Game Actions

Game actions are called via `AbilityDsl.actions`. All accept an optional `propertyFactory`: either a plain properties object or `(context) => properties`. The `target` property inside the factory sets which card/player is affected.

When no `target` is provided, the action defaults to `context.source`.

Every factory also takes an optional `<Target extends BaseCard>` type parameter, so the `context` inside a `(context) => properties` factory is typed the same way as the ability's target (see [Typed Targets & Events](#typed-targets--events-typescript)):

```typescript
gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
    target: context.target,   // DrawCard | undefined — no cast
    effect: AbilityDsl.effects.modifyMilitarySkill(2)
}))
```

Omit it (the default) and the inner `context` is the legacy untyped shape — fine for the many cards that don't read typed members off `context.target`.

The tables below cover the most-used factories; the authoritative list lives in `server/game/GameActions/GameActions.ts` (~100 exports). Niche actions not listed here include `attachToRing`, `dishonorProvince`, `placeFateAttachment`, `putIntoProvince`, `performGloryCount`, `refillFaceup`, `selectRing`, `selectToken`, `resolveConflictRing`, `removeRingFromPlay`, `returnRingToPlay`, `moveStatusToken`, `flipImperialFavor`, `fateBid`, `setHonorDial`, `modifyBid`, `triggerAbility`, `duelAddParticipant`, `immediatelyResolveConflict`, `duelLastingEffect`, `cardMenu`, `chooseAction`, `onAffinity`, `jointContext`, `multipleContext`, `sequentialContext`, `playCard`.

### Card actions

| Function | Default target | Notes |
|----------|---------------|-------|
| `actions.bow()` | source | |
| `actions.ready()` | source | |
| `actions.honor()` | source | |
| `actions.dishonor()` | source | |
| `actions.taint()` | source | |
| `actions.sacrifice()` | source | Discards from play, triggers "when sacrificed" |
| `actions.discardFromPlay()` | source | Discards from play, no sacrifice trigger |
| `actions.discardCard()` | source | Discards from hand/deck |
| `actions.returnToHand()` | source | |
| `actions.returnToDeck({ bottom?: boolean })` | source | |
| `actions.removeFromGame()` | source | |
| `actions.putIntoPlay({ fate?, status? })` | source | Puts character into home |
| `actions.putIntoConflict({ fate?, status? })` | source | Puts character into conflict |
| `actions.opponentPutIntoPlay()` | source | Opponent gets control |
| `actions.moveToConflict()` | source | Sends character to the active conflict |
| `actions.sendHome()` | source | Returns character home |
| `actions.placeFate({ amount? })` | source | Place fate on a card |
| `actions.removeFate({ amount? })` | source | Remove fate from a card (default 1) |
| `actions.attach()` | source | Attach to a character |
| `actions.detach()` | source | Remove attachment from parent |
| `actions.reveal()` | source | Reveal a facedown card |
| `actions.lookAt()` | source | Look at a facedown card (not revealed publicly) |
| `actions.flipDynasty()` | source | Flip dynasty card |
| `actions.moveCard({ destination, shuffle?, faceup? })` | source | Move to a specific location |
| `actions.breakProvince()` | source | Break a province |
| `actions.restoreProvince()` | source | Restore a broken province |
| `actions.takeControl()` | source | Change controller |
| `actions.turnFacedown()` | source | Turn card facedown |
| `actions.gainStatusToken()` | source | Add a status token |
| `actions.discardStatusToken()` | source | Remove a status token |
| `actions.addToken()` | source | Add a token to a card |
| `actions.createToken()` | source | Create a token character |
| `actions.placeCardUnderneath()` | source | Place under another card |
| `actions.cardLastingEffect({ effect, duration? })` | target | Apply a lasting effect to specific cards |

### Player actions

| Function | Notes |
|----------|-------|
| `actions.gainFate({ amount? })` | Default amount 1 |
| `actions.loseFate({ amount? })` | |
| `actions.gainHonor({ amount? })` | |
| `actions.loseHonor({ amount? })` | |
| `actions.takeFate({ amount? })` | Transfer fate from opponent |
| `actions.takeHonor({ amount? })` | Transfer honor from opponent |
| `actions.draw({ amount? })` | Draw conflict cards |
| `actions.chosenDiscard({ amount? })` | Opponent-choice discard |
| `actions.chosenReturnToDeck({ amount? })` | Return chosen card to deck |
| `actions.discardAtRandom({ amount? })` | Discard random card(s) |
| `actions.discardMatching()` | Discard matching card(s) |
| `actions.deckSearch({ ... })` | Search deck (see [Deck Search](#deck-search)) |
| `actions.shuffleDeck()` | Shuffle a deck |
| `actions.fillProvince()` | Refill a province |
| `actions.honorBid()` | Initiate an honor bid |
| `actions.initiateConflict()` | Initiate a conflict |
| `actions.playerLastingEffect({ effect, duration?, targetController? })` | Lasting effect on player |
| `actions.claimImperialFavor()` | Claim the Imperial Favor |
| `actions.loseImperialFavor()` | Discard the Imperial Favor |

### Ring actions

| Function | Notes |
|----------|-------|
| `actions.claimRing()` | Claim a ring for a player |
| `actions.returnRing()` | Return a claimed ring |
| `actions.takeRing()` | Transfer ring to another player |
| `actions.placeFateOnRing({ amount?, origin? })` | Place fate on a ring |
| `actions.takeFateFromRing({ amount? })` | Remove fate from a ring |
| `actions.resolveRingEffect()` | Resolve the ring element effect |
| `actions.switchConflictElement()` | Switch the conflict ring's element |
| `actions.switchConflictType()` | Switch conflict type (mil↔pol) |
| `actions.ringLastingEffect({ effect, duration? })` | Lasting effect on a ring |

### Meta / control flow actions

| Function | Notes |
|----------|-------|
| `actions.multiple([...actions])` | Execute multiple actions simultaneously. Takes an array, not a factory |
| `actions.sequential([...actions])` | Execute actions in sequence. Takes an array |
| `actions.joint([...actions])` | Execute actions requiring same target |
| `actions.conditional({ condition, trueGameAction, falseGameAction })` | Branch on condition |
| `actions.ifAble({ gameAction, fallbackGameAction? })` | Do `gameAction` if legal, else `fallbackGameAction` |
| `actions.chooseAction({ choices, activePromptTitle? })` | Prompt player to choose between actions |
| `actions.menuPrompt({ ... })` | Show a free-form menu prompt |
| `actions.selectCard({ cardCondition?, gameAction, ... })` | Prompt to select a card, then apply `gameAction` |
| `actions.cancel()` | Cancel the triggering event (for interrupts) |
| `actions.handler({ handler })` | Run arbitrary code as an action |
| `actions.noAction()` | No-op |
| `actions.duel({ ... })` | Initiate a duel (see [Duels](#duels)) |
| `actions.conflictLastingEffect({ ... })` | Lasting effect scoped to conflict |

---

## Deck Search

`actions.deckSearch` is one of the most configurable actions.

```typescript
AbilityDsl.actions.deckSearch({
    amount: -1,                    // -1 = entire deck (default), or a number to look at top N
    numCards: 1,                   // how many cards to select
    targetMode: TargetModes.UpTo,  // Single, UpTo, Exactly, Unlimited
    deck: Decks.ConflictDeck,      // ConflictDeck or DynastyDeck
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand }),
    takesNothingGameAction: AbilityDsl.actions.draw(),
    message: '{0} takes {1}',
    messageArgs: (context, cards) => [context.player, cards],
    shuffle: true,                 // shuffle deck afterwards (default true)
    reveal: true,                  // reveal selected cards to all
    uniqueNames: false             // prevent selecting two cards with same name
})
```

`takesNothingGameAction` fires when the player picks nothing (chooses "Take nothing").

---

## Lasting Effects

Lasting effects are applied via `actions.cardLastingEffect`, `actions.playerLastingEffect`, or `actions.ringLastingEffect`. They take `duration` and `effect` (one or more `AbilityDsl.effects` values).

```typescript
gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
    target: context.targets.target,
    duration: Durations.UntilEndOfConflict,
    effect: AbilityDsl.effects.modifyMilitarySkill(2)
}))
```

### Durations

| Constant | Resets |
|----------|--------|
| `Durations.UntilEndOfConflict` | Default — end of current conflict |
| `Durations.UntilEndOfPhase` | End of current phase |
| `Durations.UntilEndOfRound` | End of round |
| `Durations.UntilEndOfDuel` | End of current duel |
| `Durations.UntilPassPriority` | Next time anyone passes priority |
| `Durations.UntilOpponentPassPriority` | Opponent passes priority |
| `Durations.UntilSelfPassPriority` | Controller passes priority |
| `Durations.Persistent` | Never expires (use `persistentEffect`, not a lasting effect) |

Multiple effects can be combined as an array:

```typescript
effect: [
    AbilityDsl.effects.modifyMilitarySkill(3),
    AbilityDsl.effects.doesNotBow()
]
```

---

## Effects Reference

Effects are used inside `persistentEffect` and `*lastingEffect`. They are factories — call them with arguments, pass the result to `effect:`.

The authoritative list lives in `server/game/effects.ts`. Tables below cover the common cases — when an effect you expect is missing, grep that file.

### Skill modifiers (card)

| Effect | Description |
|--------|-------------|
| `effects.modifyMilitarySkill(n)` | +N military skill |
| `effects.modifyPoliticalSkill(n)` | +N political skill |
| `effects.modifyBothSkills(n)` | +N both skills |
| `effects.setMilitarySkill(n)` | Set military skill to N |
| `effects.setPoliticalSkill(n)` | Set political skill to N |
| `effects.setBaseMilitarySkill(n)` | Set base (printed) military to N |
| `effects.setBasePoliticalSkill(n)` | Set base (printed) political to N |
| `effects.setBaseDash(type)` | Set a skill to dash |
| `effects.setDash(type)` | Set effective skill to dash |
| `effects.modifyMilitarySkillMultiplier(n)` | Multiply military skill by N |
| `effects.modifyPoliticalSkillMultiplier(n)` | Multiply political skill by N |
| `effects.modifyGlory(n)` | +N glory |
| `effects.setGlory(n)` | Set glory to N |
| `effects.modifyBaseProvinceStrength(n)` | Modify base province strength |
| `effects.modifyProvinceStrength(n)` | +N province strength |
| `effects.setBaseProvinceStrength(n)` | Set base province strength |
| `effects.setProvinceStrength(n)` | Set effective province strength |
| `effects.switchBaseSkills()` | Swap printed mil/pol skills |

### Identity / type changes (card)

| Effect | Description |
|--------|-------------|
| `effects.addTrait(trait)` | Add a trait |
| `effects.loseTrait(trait)` | Remove a trait |
| `effects.addFaction(faction)` | Add a faction |
| `effects.loseFaction(faction)` | Remove a faction |
| `effects.addKeyword(keyword)` | Add a keyword |
| `effects.loseKeyword(keyword)` | Remove a keyword |
| `effects.changeType(type)` | Change card type |
| `effects.blank()` | Blank all non-keyword abilities |
| `effects.loseAllNonKeywordAbilities()` | Remove non-keyword abilities |
| `effects.copyCard(card)` | Copy all abilities from another card |
| `effects.gainAbility(abilityType, props)` | Grant an ability |
| `effects.gainAllAbilities(card)` | Copy all abilities from a specific card |
| `effects.takeControl(player)` | Change controller |
| `effects.entersPlayWithStatus(status)` | Card enters play with a token |

### Participation / conflict (card)

| Effect | Description |
|--------|-------------|
| `effects.doesNotBow()` | Character doesn't bow at end of conflict |
| `effects.doesNotReady()` | Character doesn't ready during regroup |
| `effects.cannotParticipateAsAttacker(type)` | Block as attacker (default 'both') |
| `effects.cannotParticipateAsDefender(type)` | Block as defender (default 'both') |
| `effects.mustBeDeclaredAsAttacker()` | Must participate as attacker |
| `effects.mustBeDeclaredAsDefender(type)` | Must participate as defender |
| `effects.contributeToConflict(player)` | Allows contributing to specified player's side |
| `effects.cannotBeAttacked()` | Province cannot have conflicts declared against it |
| `effects.participatesFromHome(props)` | Character can trigger abilities even from home |
| `effects.triggersAbilitiesFromHome(props)` | Same — triggers abilities from home |

### Attachment restrictions (card)

| Effect | Description |
|--------|-------------|
| `effects.attachmentTraitRestriction(traits)` | Only attach to characters with these traits |
| `effects.attachmentFactionRestriction(factions)` | Only attach to these factions |
| `effects.attachmentCardCondition(func)` | Custom attach condition |
| `effects.attachmentMyControlOnly()` | Only attach to own characters |
| `effects.attachmentOpponentControlOnly()` | Only attach to opponent's characters |
| `effects.attachmentUniqueRestriction()` | Card is unique (restrict duplicates) |
| `effects.attachmentLimit(n)` | Max N attachments on parent |
| `effects.cannotHaveOtherRestrictedAttachments(card)` | No other restricted attachments |

### Ability modifications (card)

| Effect | Description |
|--------|-------------|
| `effects.cardCannot({ cannot, restricts? })` | Prevent specific actions on a card |
| `effects.immunity({ restricts, playerRestrictions? })` | Make card immune to certain effects |
| `effects.increaseLimitOnAbilities(abilities)` | Increase limit max for specified abilities |
| `effects.fateCostToAttack(n)` | Cost N fate to declare card as attacker |
| `effects.honorCostToDeclare(n)` | Cost N honor to declare card |
| `effects.suppressEffects(condition)` | Suppress certain effects on this card |
| `effects.cannotApplyLastingEffects(condition)` | Block lasting effects on this card |
| `effects.honorStatusDoesNotModifySkill()` | Honored/dishonored status doesn't affect skill |
| `effects.honorStatusDoesNotAffectLeavePlay()` | Status tokens don't trigger on leave-play |

### Player effects

| Effect | Description |
|--------|-------------|
| `effects.reduceCost({ amount, match?, limit? })` | Reduce play cost |
| `effects.increaseCost({ amount, match? })` | Increase play cost |
| `effects.reduceNextPlayedCardCost(n, match)` | Reduce cost of next matching card |
| `effects.additionalAction(n)` | Grant N extra actions this window |
| `effects.additionalConflict(type)` | Grant extra conflict opportunity |
| `effects.additionalCharactersInConflict(n)` | Allow N extra characters in conflict |
| `effects.playerCannot({ cannot, restricts? })` | Prevent player from taking an action |
| `effects.cannotDeclareConflictsOfType(type)` | Block conflict type |
| `effects.changePlayerSkillModifier(n)` | Modify player's total conflict skill |
| `effects.modifyHonorTransferGiven(n)` | Modify honor transfers given |
| `effects.modifyHonorTransferReceived(n)` | Modify honor transfers received |
| `effects.gainActionPhasePriority()` | Player has priority this action phase |
| `effects.canPlayFromOwn(location, cards, playType)` | Play cards from non-standard location |
| `effects.showTopConflictCard(players)` | Show top conflict card to player(s) |
| `effects.eventsCannotBeCancelled()` | Events cannot be cancelled |
| `effects.additionalPlayCost(func)` | Add extra cost to playing a card |

### Conflict-scope effects

| Effect | Description |
|--------|-------------|
| `effects.charactersCannot({ cannot })` | All characters cannot do X in the conflict |
| `effects.cannotContribute(func)` | Prevent a card from contributing skill |
| `effects.forceConflictUnopposed()` | Conflict counts as unopposed |
| `effects.restrictNumberOfDefenders(n)` | Limit number of defenders |

### Duel effects

| Effect | Description |
|--------|-------------|
| `effects.modifyDuelistSkill(value, duel?)` | Modify the card's contribution to a duel (optionally scoped to a specific `Duel` instance) |
| `effects.winDuel(duel)` | Force win a duel |
| `effects.winDuelTies()` | Win tied duels |
| `effects.duelIgnorePrintedSkill()` | Ignore printed skill in duel |
| `effects.applyStatusTokensToDuel()` | Status tokens apply to duel |

---

## Duels

Duels are initiated via `initiateDuel:` on an action/reaction, or via `actions.duel()`.

```typescript
this.action({
    title: 'Duel target character',
    initiateDuel: {
        type: DuelTypes.Military,
        requiresConflict: true,   // default true — source and target must be participating
        challengerCondition: (card, context) => card === context.source,
        targetCondition: (card, context) => card.isParticipating(),
        gameAction: (duel, context) =>
            AbilityDsl.actions.discardFromPlay({ target: duel.loser }),
        message: 'discard {0}',
        messageArgs: (duel, context) => duel.loser,
        refuseGameAction: AbilityDsl.actions.gainHonor({ target: context => context.player.opponent })
    }
});
```

| Field | Description |
|-------|-------------|
| `type` | `DuelTypes.Military`, `DuelTypes.Political`, or `DuelTypes.Glory` |
| `requiresConflict` | Default `true`. Challenger and target must be participating |
| `challengerCondition` | Filter for who can be the challenger (overrides default participation check on the challenger) |
| `targetCondition` | Filter for legal duel targets (overrides default participation check on the target) |
| `opponentChoosesDuelTarget` | Opponent selects the target |
| `opponentChoosesChallenger` | Opponent selects the challenger |
| `gameAction` | `(duel, context) => GameAction` — the effect resolved when the duel ends. `duel.winner` / `duel.loser` are `DrawCard[]` (empty array on tie) |
| `message` / `messageArgs` | Chat message for the resolution step; `messageArgs: (duel, context) => any \| any[]` |
| `refuseGameAction` | Effect when the opponent legally refuses the duel (consult `Duel.ts`) |
| `refusalMessage` / `refusalMessageArgs` | Chat output when refused |
| `costHandler` | Custom focus-cost handler |
| `challengerEffect` / `targetEffect` | Pre-resolution per-side effects |
| `statistic` | `(card, rules) => number` — override skill statistic used in resolution |

When `requiresConflict: true` (default), do not add a redundant `isDuringConflict()` condition or `source.isParticipating()` condition — the duel system enforces both. There is no `winnerHandler`/`loserHandler`/`tieHandler` indirection — express win/loss/tie effects by branching on `duel.winner.length` / `duel.loser.length` inside the single `gameAction` factory.

---

## Constants Reference

Import from `'../Constants'` (adjust path for nesting).

### `Phases`
`Setup`, `Dynasty`, `Draw`, `Conflict`, `Fate`, `Regroup`

### `CardTypes`
`Stronghold`, `Role`, `Province`, `Character`, `Holding`, `Event`, `Attachment`

### `Locations`
`Any`, `Hand`, `ConflictDeck`, `DynastyDeck`, `ConflictDiscardPile`, `DynastyDiscardPile`, `PlayArea`, `Provinces` (string value `'province'`, grouping all four slots), `ProvinceOne`–`ProvinceFour`, `StrongholdProvince`, `ProvinceDeck`, `RemovedFromGame`, `UnderneathStronghold`, `OutsideTheGame`, `BeingPlayed`, `Role`

### `Players`
`Self`, `Opponent`, `Any`

### `Durations`
`UntilEndOfConflict` (default for `cardLastingEffect`), `UntilEndOfPhase`, `UntilEndOfRound`, `UntilEndOfDuel`, `UntilPassPriority`, `UntilOpponentPassPriority`, `UntilSelfPassPriority`, `UntilNextPassPriority`, `Persistent`, `Custom`

### `AbilityTypes`
`Action`, `Reaction`, `ForcedReaction`, `Interrupt`, `ForcedInterrupt`, `WouldInterrupt` (string value `'cancelinterrupt'`), `KeywordInterrupt`, `KeywordReaction`, `DuelReaction`, `Persistent`, `OtherEffects`

### `ConflictTypes`
`Military`, `Political`, `Passed`, `Forced`

### `Stages`
`Cost`, `Effect`, `PreTarget`, `Target`

### `TargetModes`
`Single` (default), `UpTo`, `UpToVariable`, `Exactly`, `ExactlyVariable`, `Unlimited`, `MaxStat`, `Ring`, `Select`, `Ability`, `Token`, `ElementSymbol`, `AutoSingle`

### `DuelTypes`
`Military`, `Political`, `Glory`

### `Elements`
`Fire`, `Earth`, `Air`, `Water`, `Void`

### `Decks`
`ConflictDeck`, `DynastyDeck`

### `CharacterStatus`
`Honored`, `Dishonored`, `Tainted`

### `FavorTypes`
`Military`, `Political`, `Both`

### `PlayTypes`
`PlayFromHand`, `PlayFromProvince`, `Other`

### `EventNames`
Key events used in `when:` clauses:

| EventName | Fires when |
|-----------|-----------|
| `OnCharacterEntersPlay` | A character enters play |
| `OnCardLeavesPlay` | A card leaves play |
| `OnCardBowed` | A card is bowed |
| `OnCardReadied` | A card is readied |
| `OnCardHonored` | A card is honored |
| `OnCardDishonored` | A card is dishonored |
| `OnCardTainted` | A card is tainted |
| `OnCardAttached` | An attachment is attached |
| `OnCardDetached` | An attachment is detached |
| `OnCardPlayed` | A card is played from hand |
| `OnMoveToConflict` | A character moves into conflict |
| `OnSendHome` | A character is sent home |
| `OnBreakProvince` | A province is broken |
| `OnConflictDeclared` | A conflict is declared |
| `OnConflictFinished` | A conflict ends |
| `AfterConflict` | After all post-conflict triggers resolve |
| `OnDuelInitiated` | A duel starts |
| `OnDuelFinished` | A duel ends |
| `OnDuelStrike` | During duel strike step |
| `OnCardsDrawn` | Cards are drawn |
| `OnTransferHonor` | Honor is transferred |
| `OnModifyHonor` | Honor total changes |
| `OnModifyFate` | Fate total changes |
| `OnRoundEnded` | Round ends |
| `OnPhaseEnded` | Phase ends |
| `OnAbilityResolverInitiated` | A non-card-ability resolver begins (rare; cards fire `OnCardAbilityInitiated`) |
| `OnCardAbilityInitiated` | A card ability's resolver opens its initiate-ability event window (after PreTarget resolution, before costs/targets) |
| `OnCardAbilityTriggered` | A triggered card ability is being initiated (queued alongside `OnCardAbilityInitiated`) |

---

## Common Patterns

### Bow something and honor something else

```typescript
gameAction: AbilityDsl.actions.multiple([
    AbilityDsl.actions.bow((context) => ({ target: context.targets.bow })),
    AbilityDsl.actions.honor((context) => ({ target: context.targets.honor }))
])
```

### Give a card a lasting effect for the conflict

```typescript
gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
    target: context.targets.target,
    duration: Durations.UntilEndOfConflict,
    effect: [
        AbilityDsl.effects.modifyMilitarySkill(3),
        AbilityDsl.effects.doesNotBow()
    ]
}))
```

### Search a deck and put selected card into hand

```typescript
gameAction: AbilityDsl.actions.deckSearch({
    deck: Decks.ConflictDeck,
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
})
```

### Conditional effect (if X then bow, else dishonor)

```typescript
gameAction: AbilityDsl.actions.conditional({
    condition: (context) => context.targets.target.isHonored,
    trueGameAction: AbilityDsl.actions.bow(),
    falseGameAction: AbilityDsl.actions.dishonor()
})
```

### Grant an ability while a condition is true (composure example)

```typescript
this.composure({
    effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
        title: 'Draw a card',
        condition: (context) => context.source.isParticipating(),
        gameAction: AbilityDsl.actions.draw((context) => ({ target: context.player }))
    })
});
```

### Reduce cost of next matching card

```typescript
gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
    targetController: context.player,
    effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card) => card.hasTrait('shugenja'))
}))
```

### Reaction from discard pile

```typescript
this.reaction({
    title: 'Shuffle back into deck',
    location: Locations.DynastyDiscardPile,   // fire from discard, not play
    when: {
        onCardLeavesPlay: (event, context) => event.card === context.source
    },
    gameAction: AbilityDsl.actions.moveCard({
        destination: Locations.DynastyDeck,
        shuffle: true
    })
});
```

### Chain a follow-up prompt with `then:`

```typescript
this.action({
    title: 'Bow, then choose an effect',
    target: {
        cardType: CardTypes.Character,
        gameAction: AbilityDsl.actions.bow()
    },
    then: {
        target: {
            mode: TargetModes.Select,
            choices: {
                'Gain 1 honor': AbilityDsl.actions.gainHonor(),
                'Draw 1 card': AbilityDsl.actions.draw()
            }
        }
    }
});
```

---

## Tips for New Card Designers

**`condition` vs `cardCondition`**

- `condition: (context) => bool` on the top-level ability gates the entire ability — if it returns `false`, the button doesn't appear.
- `cardCondition: (card, context) => bool` on a `target:` filters which individual cards are legal targets.

**`isParticipating()` implies a conflict**

If any `cardCondition` or `condition` checks `card.isParticipating()`, you don't need `context.game.isDuringConflict()` — the participation check already implies a conflict is active.

**`requiresConflict` and duels**

`initiateDuel` with `requiresConflict: true` (the default) already ensures a conflict is ongoing and that both challenger and target are participating. Don't add a duplicate `isDuringConflict()` condition or `source.isParticipating()` check — the duel helper enforces them.

**`target` vs `targets`**

Use `target:` for a single selection. Use `targets:` when you need multiple distinct selections (e.g., choose one character to bow and a different one to honor). Targets within `targets:` can chain via `dependsOn:`.

**`multiple` vs `sequential`**

`multiple([...])` resolves all actions simultaneously — effects are applied together. `sequential([...])` queues actions one by one. Use `sequential` when the second action depends on the result of the first.

**Effect targeting: `match` vs `target`**

In `persistentEffect`, `match: (card) => bool` filters which cards are continuously affected. In `cardLastingEffect`, `target:` is the card you're applying it to right now.
