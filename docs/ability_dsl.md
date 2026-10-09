# Ability DSL Reference

This document describes the ability DSL used to implement card effects. A card imports what it uses from four modules:

| Module | Purpose | Import |
|--------|---------|--------|
| `GameActions/GameActions.ts` | Game actions (bow, honor, discard, move, etc.) | named |
| `effects.ts` | Effect factories for lasting/persistent effects | named |
| `costs/index.ts` | Cost functions | namespace `costs` |
| `AbilityLimit.ts` | Limit constructors | named |

```typescript
import { bow, cardLastingEffect } from '../../GameActions/GameActions.js';
import { modifyMilitarySkill } from '../../effects.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
```

Costs go through the `costs` namespace because cost names such as `bow` and `dishonor` clash with the actions. The only effect and action sharing a name is `takeControl`; import one of them with `as`.

---

## Card Class Structure

Every card extends `DrawCard` (characters, attachments, events), `ProvinceCard` or `StrongholdCard`. Abilities are declared in `setupCardAbilities()`.

```typescript
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';

export default class MyCard extends DrawCard {
    static id = 'my-card';

    setupCardAbilities() {
        this.action('...')...;
        this.reaction('...').when({ ... })...;
        this.persistentEffect({ ... });
    }
}
```

Actions and triggered abilities are declared with a builder: the method takes the title, and each chained call adds one part of the ability. Builders are registered when `setupCardAbilities` returns, so there is no terminal `.build()`. Persistent effects, composure/dire effects and attachment conditions still take a properties object.

A titled ability can only be started inside `setupCardAbilities`. To add one later (for example a test-only ability), wrap it in `card.declareAbilities(() => { ... })`, which registers it when it returns.

---

## Ability Types

### `this.action(title)`

Player-triggered ability usable during action windows.

```typescript
this.action('Bow a character')
    .phase(Phase.Conflict)
    .condition((context) => context.source.isParticipating())
    .cost(costs.bowSelf())
    .target({
        cardType: CardType.Character,
        cardCondition: (card) => card.isParticipating()
    }, bow())
    .limit(perConflict(1))
    .chatText('bow {0}');
```

The builder fixes its types from left to right: each call sees what earlier calls declared. Declare targets and costs before the `gameAction`, `handler`, `chatText` and `then` that read them.

Builder methods shared by actions and triggered abilities:

| Method | Description |
|--------|-------------|
| `cost(cost)` | A cost to pay before resolving (see [Costs](#costs)). Call once per cost. Costs that record a result put it in `context.costs`, typed but optional (it is only set once paid) |
| `target(props, ...actions)` | A card target (see [Targets](#targets)) |
| `targetCards(props, ...actions)` | Several cards, by `mode` |
| `ringTarget(props, ...actions)` | A ring target |
| `select(props, choices)` / `selectFrom` | A choice between labelled options; a `select` choice is a game action, or a condition for a choice without game actions (`No: () => true`) |
| `tokenTarget` / `abilityTarget` / `elementTarget` | Status tokens, a printed ability (always `context.targetAbility`, so it takes no `name`), an element symbol on a chosen card |
| `gameAction(...actions)` | Action(s) to resolve (see [Game Actions](#game-actions)) |
| `handler(fn)` | Low-level handler called after costs are paid (use `gameAction` when possible). It replaces the step's resolution: combined with game actions, `if()`, `onAffinity()`, a following step or resolving again, setup throws. Game actions on a target stay allowed; they only decide what can be chosen. To run code as one action among others (raising an event, so a following step can follow), use `gameAction(handler({ handler }))` |
| `effect(message, args?)` | Chat log message. `{0}` = the target (or source), `{1}` onwards = the entries of `args(context)` |
| `then()` | Starts the next step ("Then, …"), declared with the same methods; its context holds the targets chosen so far |
| `thenIf(fn)` | "Then, if …": the next step follows when this step resolved in full and `fn(context)` holds |
| `afterwards()` | A next step without "then" on the card: it follows whether or not this step resolved in full |
| `afterwardsIf(fn)` | "If …" read after this step, without "then" on the card ("If it is now …"): the next step follows when `fn(context)` holds |
| `message(fn)` | A step's message: `fn(context)` returns a `msg` template, or `undefined` for none |
| `mayResolveAgain({ cost?, label?, condition? })` | "Then, you may [pay] to resolve this ability again": the player may pay `cost` (button "{label} to resolve this ability again") to resolve it once more; on the second resolution the cost is offered "for no effect". Without a cost, a Yes/No question |
| `opponentMayResolveAgain(prompt)` | "Then, your opponent may resolve this ability" |
| `onResolve(fn)` | Runs `fn(context)` when the ability (or step) starts resolving its effects, before its handler or game actions; never during a legality check (bookkeeping: counting uses, remembering a target) |
| `onAffinity(trait, { prompt?, chatText? })` | "With [trait] affinity" (usually an element, but any trait such as Shadow; a player has affinity to a trait while they control a character with it): the ability's or step's game actions resolve only with that affinity. `prompt` asks Yes/No first; `chatText(context)` is a `msg` template for the chat line "{player} channels their {trait} affinity to …" (by default the actions' own text). `chatText` is always the fragment after "to" ("uses X to …", "chooses to …"), `message` a whole chat line, and `effect` a game effect |
| `if(fn)`, `otherwise()` | "If …, otherwise …": the game actions after `if()` resolve when `fn(context)` holds, the ones after `otherwise()` (optional) when it doesn't. Targets go before `if()`; right after a card target, the branches are that target's (they resolve on the chosen card, after its own game actions if it has any); after several card targets without game actions, or once the ability has game actions of its own, they stay on the ability, and the actions name their targets. Branch lines are indented one level deeper |
| `gainHonor(n)`, `loseHonor(n)`, `gainFate(n)`, `loseFate(n)`, `draw(n)` | The player of the ability gains honor, loses honor, gains fate, loses fate, draws cards; `n` defaults to 1. For another target or a computed amount, pass the factory's properties instead, or a function of the context returning them: `.loseHonor((context) => ({ target: context.player.opponent }))` |
| `ready(props?)`, `bow`, `honor`, `dishonor`, `placeFate`, `removeFate`, `sendHome`, `moveToConflict`, `discardFromPlay`, `sacrifice`, `takeHonor`, `takeFate`, `refillFaceup(props)`, `cardLastingEffect(props)`, `playerLastingEffect(props)`, `selectCard(props)`, `deckSearch(props)`, `cancel(props?)` (interrupts) | Shortcuts for `gameAction(x(props))`: the same properties as the factory, or a function of the context returning them; `gameAction()` takes any other action |
| `initiateDuel(fn)` | Wires a duel as the ability's effect (see [Duels](#duels)) |
| `limit(limit)` / `max(limit)` | Usage limit (see [Limits](#limits)) |
| `location(location)` | Where the card must be to use the ability. Default: the hand for events, the provinces for provinces and holdings, the stronghold province for strongholds, otherwise the play area |
| `cannotTargetFirst()` | Skip PreTarget early-target resolution — targets are resolved only after costs (`Stage.Target`) |
| `cannotBeMirrored()` | The Mirror's Gaze can't copy it |
| `notPrinted()` | Not printed on the card, so effects that copy or count printed abilities skip it |
| `anyPlayer()` | Either player may trigger it (default: only the controller); not with `aggregateWhen` |
| `condition(fn)` | Extra gate — the ability (action or triggered) can only be used while `fn(context)` returns `true` |

Each setting is given once: a second `condition()`, `chatText()`, `limit()`, `location()`, … throws, as does an ability's own setting after `then()`. Settings that would be ignored don't compile or throw at setup: the action-only methods below on a reaction, `onAffinity()` without game actions of its own (a target's aren't covered), `initiateDuel()` together with a `target()`, two targets with one name.

Action-only methods (the province ones on province cards only; a compile error elsewhere):

| Method | Description |
|--------|-------------|
| `phase(phase)` | Phase restriction. Default `'any'`. During the Dynasty phase, only Holding/Character/Attachment cards (or `evenDuringDynasty()`, or events allowed by `dynastyPhaseCanPlayConflictEvents`) may trigger |
| `evenDuringDynasty()` | Allow triggering during the Dynasty phase without the default per-type restrictions |
| `canTriggerOutsideConflict()` | Province actions can fire when no conflict is at a province |
| `conflictProvinceCondition(fn)` | Which conflict provinces allow the action (default: `province === this.card`) |

`this.conflictAction(title, { conflictType?, evenFromHome? })` is an action that can only be used during a conflict (of that type). On a character the character must be participating, on an attachment in play its character must be; `evenFromHome` drops that. Events and holdings only need the conflict.

### `this.reaction(title)`

Reaction that fires after a triggering event. The player chooses whether to use it. The first call after the title is `when` (or `aggregateWhen`); the rest is the same as an action.

```typescript
this.reaction('Gain 1 honor')
    .when({
        onCharacterEntersPlay: (event, context) =>
            event.card.controller === context.player
    })
    .gainHonor()
    .limit(perRound(1));
```

Triggered abilities also have `collectiveTrigger()`: trigger once for events that happen together (a compile error on an action).

### `this.interrupt(title)`

Interrupt fires before the triggering event resolves. Useful for cancels and redirections.

```typescript
this.interrupt('Gain 1 fate')
    .when({
        onCardLeavesPlay: (event, context) => event.card === context.source
    })
    .gainFate();
```

### Forced variants

`this.forcedReaction(title)` and `this.forcedInterrupt(title)` fire automatically — the player cannot opt out. Used for mandatory effects (e.g., "when X happens, you must Y").

### `this.wouldInterrupt(title)`

Fires "before" the triggering event is queued at all. Used for "would" effects — prevention or modification before the event happens. `.cancel()` cancels the event (optionally with a `replacementGameAction`).

```typescript
this.wouldInterrupt('Cancel a duel')
    .when({
        onDuelInitiated: (event, context) => !!event.context && event.context.player === context.player.opponent
    })
    .cancel()
    .chatText('cancel the duel');
```

### Duel-window helpers

`this.duelChallenge(title, duelCondition?)`, `this.duelFocus(title, duelCondition?)` and `this.duelStrike(title, duelCondition?)` wire the trigger to the corresponding duel step. They take an optional `duelCondition: (duel, context) => boolean` instead of a `when` map, and `context.event.duel` is the duel.

### `when` and `aggregateWhen`

Triggered abilities take either `when` (checks individual events) or `aggregateWhen` (checks all events in a window at once).

`when` is a map from `EventName` to a predicate:

```typescript
.when({
    onCardLeavesPlay: (event, context) => event.card === context.source,
    onCardBowed:      (event, context) => event.card.controller === context.player
})
```

Multiple keys in `when` are OR'd — the ability triggers if any key matches. Each `event` is typed by its key, and `context.event` in the rest of the ability is typed by the keys — see [Typed Targets & Events](#typed-targets--events-typescript).

`aggregateWhen` receives all events:

```typescript
.aggregateWhen((events, context) =>
    events.some((event) => event.name === EventName.OnCardBowed && event.context?.player === context.player))
```

### `this.persistentEffect(props: PersistentEffectProps)`

A continuous effect active while the card is in play (or in the specified `location`).

```typescript
this.persistentEffect({
    condition: (context) => context.source.isParticipating(),
    match: (card) => card.hasTrait('cavalry'),
    effect: modifyMilitarySkill(2)
});
```

| Field | Description |
|-------|-------------|
| `location` | Where the source must be for the effect to be active. Default: `Location.PlayArea` |
| `condition` | Dynamic gate — re-evaluated each action/event window |
| `match` | Which cards are affected. Omit to target the source card itself |
| `targetController` | `Players.Self`, `Players.Opponent`, `Players.Any` |
| `targetLocation` | Where the affected cards must be |
| `effect` | One or more effect factory results from `effects.ts` |

### `this.composure(props)`

Sugar for `persistentEffect` with `condition: context.player.hasComposure()`. Active while the controller has composure.

```typescript
this.composure({
    effect: gainAbility.action('Draw a card', (ability) => ability.gameAction(draw()))
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

Each target method takes the target's properties and the game actions that resolve on it. The chosen card is stored in `context.targets[name]`. Without a `name` property the target is named `target`, which is also `context.target` and `{0}` in the effect message (a ring target named `target` is `context.ring`, a select named `target` is `context.select`). An ability with several targets names them (`name: 'character'`), and a target can depend on an earlier one with `dependsOn: 'character'`.

### Single card target

```typescript
.target({
    cardType: CardType.Character,      // filter by type; also types the card
    controller: Players.Opponent,       // whose cards
    location: Location.PlayArea,       // where the card must be
    cardCondition: (card, context) => card.isParticipating()   // card: DrawCard here
}, bow())
```

With `optional: true`, a skipped target holds `[]`, or `undefined` if its prompt was hidden (`hideIfNoLegalTargets: true`).

### Multiple cards

```typescript
.targetCards({
    mode: TargetMode.UpTo,
    numCards: 3,
    cardType: CardType.Character
}, bow())
```

`context.targets[name]` is then an array of cards.

| Mode | Behavior |
|------|----------|
| `UpTo` | Choose 0–N cards (`numCards`) |
| `Exactly` | Must choose exactly N cards (`numCards`) |
| `UpToVariable` | `numCardsFunc: (context) => n` |
| `ExactlyVariable` | Same, but must choose exactly that many |
| `MaxStat` | Choose up to `numCards` cards whose combined `cardStat` ≤ `maxStat()` |
| `Unlimited` | Choose any number |

### Ring target

```typescript
.ringTarget({
    ringCondition: (ring, context) => ring.isUnclaimed()
}, claimRing())
```

### Select target (prompt with labeled choices)

```typescript
this.action('Bow or honor a character')
    .target({
        name: 'character',
        cardType: CardType.Character
    })
    .select({
        name: 'choice',
        dependsOn: 'character',
        player: Players.Self
    }, {
        'Bow': bow((context) => ({ target: context.targets.character })),
        'Honor': honor((context) => ({ target: context.targets.character }))
    });
```

The choices object maps button labels to game actions or conditions `(context) => boolean`. A game action choice is shown only if it has a legal target, a condition while it holds; a handler reads the pick from `context.select`; `selectFrom` takes a function returning the choices, when they depend on the context.

### Dependent targets

```typescript
this.action('Detach an attachment')
    .target({
        name: 'attacker',
        cardType: CardType.Character,
        cardCondition: (card) => card.isAttacking()
    })
    .target({
        name: 'attachment',
        dependsOn: 'attacker',
        cardType: CardType.Attachment,
        cardCondition: (card, context) => card.parent === context.targets.attacker
    }, discardFromPlay());
```

In a dependent target's callbacks, the target it depends on is set; other earlier targets may not be chosen yet, so they are optional there.

---

## Typed Targets & Events (TypeScript)

The builder types every callback from what was declared before it, so card code reads `context` without annotations or casts.

### `context.source` is already typed

Inside any ability callback (`condition`, `handler`, `chatText` arguments, `when`, `cardCondition`, a `then` factory, etc.) `context.source` is typed to **the card's own class** — for a card that `extends DrawCard`, `context.source` is a `DrawCard`, so its members are accessible with no cast:

```typescript
this.action('Move to the conflict')
    .condition((context) => context.source.isParticipating())   // DrawCard member, no cast
    .gameAction(moveToConflict());
```

The same applies to a granted ability (`gainAbility.action(...)`, `gainAbility.reaction(...)`): its `context.source` is the card that gains it, typed `DrawCard`.

### Typed targets

Each target adds its name to `context.targets`, typed by `cardType`: `CardType.Province` gives a `ProvinceCard`, `CardType.Character` (or attachment, event, holding) a `DrawCard`, a list of types the union of theirs, and no `cardType` a `BaseCard`. `cardCondition` receives the card with the same type. `targetCards` gives an array, and an optional target adds `[]` (and `undefined`) to the type.

```typescript
this.action('Bow a character')
    .target({
        cardType: CardType.Character
    })
    .handler((context) => {
        context.target.bow();   // context.target: DrawCard
    })
    .chatText('bow {0}');
```

The types are backed by runtime checks: a callback that is called with a context which doesn't hold its declared targets throws, naming the ability.

### Typed `when` events

Inside a `when` predicate, `event` is typed by its key — `afterConflict: (event) => event.conflict...` needs no annotation. In the rest of the ability, `context.event` is the union of the payloads of the `when` keys. A province's triggered abilities may be resolved without their event (Countryside Trader), so their `context.event` is optional.

```typescript
this.reaction('Gain 1 fate')
    .when({
        afterConflict: (event, context) =>
            event.conflict.loser === context.player && context.source.isAttacking()
    })
    .gainFate();
```

Narrow on `context.event.name` (or `context.event.is(EventName.X)`) when you need a field specific to one event.

---

## Costs

Costs come from the `costs` namespace (`import * as costs from '../../costs/index.js'`). Call `.cost()` once per cost; several calls add up.

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
| `costs.payOptionalFate(n)` | Prompt to optionally pay N fate |
| `costs.payVariableFate({ maxAmount, ... })` | Prompt to pay a variable amount of fate |
| `costs.payVariableHonor(amountFunc)` | Prompt to pay a variable amount of honor |

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
| `costs.revealCardsOf(cardFunc)` | Reveal specific cards |
| `costs.reveal(props)` | Reveal a player-selected card |
| `costs.discardCardsUpToVariableX(n)` | Discard up to N cards from hand |
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
| `costs.chooseOne({ label: cost, … })` | "Pay X or Y": the player picks one of the payable costs by its label (no question when only one can be paid) |
| `costs.chooseFate(playType)` | Standard "how much extra fate" prompt for playing characters |

The `props` parameter for selection costs takes the same properties as `target:` on an ability (e.g., `cardType`, `controller`, `cardCondition`, `location`, `mode`, `numCards`).

---

## Limits

Limits track how many times an ability can be used per time period.

| Function | Resets when |
|----------|-------------|
| `fixed(n)` | Never resets — N uses total per game |
| `perGame(n)` | Never resets — alias for `fixed` with explicit name |
| `perRound(n)` | Each round ends |
| `perConflict(n)` | Each conflict ends |
| `perConflictOpportunity(n)` | Conflict ends or player passes a conflict |
| `perPhase(n)` | Each phase ends |
| `unlimitedPerConflict()` | Each conflict ends (unlimited uses within) |
| `unlimited()` | Never at max — truly unlimited |
| `repeatable(n, eventName)` | On a specific `EventName` |

`.limit()` and `.max()` both take a limit object, but they count differently (RRG):

- **`limit`** — "Limit X per [period]": uses of *this copy* of the ability, per player. Without `.limit()`, a triggered ability can be used once per round (RRG: "Unless otherwise specified, each triggered ability can only be used once per game round").
- **`max`** — "(Max X per [period])": uses across *all copies by title*, per player, whoever owns the copy.

---

## Game Actions

Game actions are named imports from `GameActions/GameActions.js` (the tables write them as `x` for grouping only). All accept an optional `propertyFactory`: either a plain properties object or `(context) => properties`. The `target` property inside the factory sets which card/player is affected.

When no `target` is provided, card actions target `context.source`, player actions target the ability's player (gain, lose, draw), take/discard actions and `loseImperialFavor` target the opponent, `amount` is 1, and a target's own action targets the chosen card. Composite actions (`multiple`, `sequential`, `conditional`, …) pass their target down when they were given one (on a target, or with `target`); otherwise each action inside keeps its own default. `selectCard`, `cardMenu` and `deckSearch` hand over the chosen cards.

Inside the builder, a `(context) => properties` factory gets the ability's typed context, so `context.target` and `context.targets.name` have the declared card types (see [Typed Targets & Events](#typed-targets--events-typescript)):

```typescript
.target({ cardType: CardType.Character }, cardLastingEffect((context) => ({
    target: context.target,   // DrawCard — no cast
    effect: modifyMilitarySkill(2)
})))
```

The tables below cover the most-used factories; the authoritative list lives in `server/game/GameActions/GameActions.ts` (~100 exports). Niche actions not listed here include `attachToRing`, `dishonorProvince`, `putIntoProvince`, `performGloryCount`, `refillFaceup`, `selectRing`, `selectToken`, `resolveConflictRing`, `removeRingFromPlay`, `returnRingToPlay`, `moveStatusToken`, `flipImperialFavor`, `fateBid`, `setHonorDial`, `modifyBid`, `triggerAbility`, `duelAddParticipant`, `duelLastingEffect`, `cardMenu`, `chooseAction`, `onAffinity`, `multipleContext`, `sequentialContext`, `playCard`.

### Card actions

| Function | Default target | Notes |
|----------|---------------|-------|
| `bow()` | source | |
| `ready()` | source | |
| `honor()` | source | |
| `dishonor()` | source | |
| `taint()` | source | |
| `sacrifice()` | source | Discards from play, triggers "when sacrificed" |
| `discardFromPlay()` | source | Discards from play, no sacrifice trigger |
| `discardCard()` | source | Discards from hand/deck |
| `returnToHand()` | source | |
| `returnToDeck({ bottom?: boolean })` | source | |
| `removeFromGame()` | source | |
| `putIntoPlay({ fate?, status? })` | source | Puts character into home |
| `putIntoConflict({ fate?, status? })` | source | Puts character into conflict |
| `opponentPutIntoPlay()` | source | Opponent gets control |
| `moveToConflict()` | source | Sends character to the active conflict |
| `sendHome()` | source | Returns character home |
| `placeFate({ amount? })` | source | Place fate on a card |
| `removeFate({ amount? })` | source | Remove fate from a card (default 1) |
| `attach()` | source | Attach to a character |
| `detach()` | source | Remove attachment from parent |
| `reveal()` | source | Reveal a facedown card |
| `lookAt()` | source | Look at a facedown card (not revealed publicly). Chat: `message: (context, cards) => msg\`…\``, by default "<source> sees <cards>" |
| `flipDynasty()` | source | Flip dynasty card |
| `moveCard({ destination, shuffle?, faceup? })` | source | Move to a specific location |
| `breakProvince()` | source | Break a province |
| `restoreProvince()` | source | Restore a broken province |
| `takeControl()` | source | Change controller |
| `turnFacedown()` | source | Turn card facedown |
| `gainStatusToken()` | source | Add a status token |
| `discardStatusToken()` | source | Remove a status token |
| `addToken()` | source | Add a token to a card |
| `createToken()` | source | Create a token character |
| `placeCardUnderneath()` | source | Place under another card |
| `setAside({ hidden?, returnAtEndOfConflict?, playableBy?, message? })` | source | Set cards aside, out of play: `hidden` keeps them facedown to the others, `returnAtEndOfConflict` gives them back to their owner's hand when the conflict ends, `playableBy` lets that player control and play them as if in hand. `message: (context, cards) => msg\`…\`` is written once |
| `cardLastingEffect({ effect, duration? })` | source | Apply a lasting effect to specific cards |

### Player actions

These target the ability's player, except `takeFate`, `takeHonor`, `chosenDiscard`, `chosenReturnToDeck`, `discardAtRandom` and `discardMatching`, which target the opponent.

| Function | Notes |
|----------|-------|
| `gainFate({ amount? })` | Default amount 1 |
| `loseFate({ amount? })` | |
| `gainHonor({ amount? })` | |
| `loseHonor({ amount? })` | |
| `takeFate({ amount? })` | Transfer fate from opponent |
| `takeHonor({ amount? })` | Transfer honor from opponent |
| `draw({ amount? })` | Draw conflict cards |
| `chosenDiscard({ amount? })` | Opponent-choice discard |
| `chosenReturnToDeck({ amount? })` | Return chosen card to deck |
| `discardAtRandom({ amount? })` | Discard random card(s) |
| `discardMatching()` | Discard matching card(s) |
| `deckSearch({ ... })` | Search deck (see [Deck Search](#deck-search)) |
| `shuffleDeck()` | Shuffle a deck |
| `fillProvince()` | Refill a province |
| `honorBid()` | Initiate an honor bid |
| `initiateConflict()` | Initiate a conflict |
| `playerLastingEffect({ effect, duration?, targetController? })` | Lasting effect on player |
| `claimImperialFavor()` | Claim the Imperial Favor |
| `loseImperialFavor()` | Discard the Imperial Favor (defaults to the opponent: pass `target: context.player` for your own) |

### Ring actions

| Function | Notes |
|----------|-------|
| `claimRing()` | Claim a ring for a player |
| `returnRing()` | Return a claimed ring |
| `takeRing()` | Transfer ring to another player |
| `placeFateOnRing({ amount?, origin? })` | Place fate on a ring |
| `takeFateFromRing({ amount? })` | Remove fate from a ring |
| `resolveRingEffect()` | Resolve the ring element effect |
| `switchConflictElement()` | Switch the conflict ring's element |
| `switchConflictType()` | Switch conflict type (mil↔pol) |
| `ringLastingEffect({ effect, duration? })` | Lasting effect on a ring |

### Meta / control flow actions

| Function | Notes |
|----------|-------|
| `multiple([...actions])` | Execute multiple actions simultaneously. Takes an array, not a factory |
| `sequential([...actions])` | Execute actions in sequence. Takes an array |
| `joint([...actions])` | Execute actions requiring same target |
| `conditional({ condition, trueGameAction, falseGameAction? })` | Branch on condition; `falseGameAction` defaults to doing nothing. On the ability itself, prefer `.if()`/`.otherwise()` |
| `ifAble({ ifAbleAction, otherwiseAction })` | Do `ifAbleAction` if it can resolve, else `otherwiseAction` |
| `chooseAction({ choices, activePromptTitle?, player? })` | A choice made while the ability resolves (a selection after the dash; one before the dash is `select`). `choices` maps each label to a game action, or to `{ action, message }` with `message: (context, target, chooser) => msg\`…\`` (`target` is the action's target) |
| `optional({ gameAction, prompt, player?, acceptMessage?, declineMessage? })` | A player (default the ability's player, or `Players.Opponent`) may resolve `gameAction` (Yes/No). For "may … If they do, …", put the consequence in a `then()` step: it runs only if they did and the action resolved (Mercenary Company). The messages are `(context, chooser) => msg\`…\`` |
| `menuPrompt({ ... })` | Show a free-form menu prompt |
| `rearrangeDeck({ amount, deck?, activePromptTitle?, message? })` | The player of the ability puts the top `amount` cards of the target player's `deck` (default: their own conflict deck) back in the order they choose, one prompt per position |
| `assignRoles({ roles, player?, pick?, activePromptTitle?, message? })` | Two cards, two roles (`{ Honor: honor(), Dishonor: dishonor() }`): the chooser gives each card a role, by role then card, or with `pick` by picking that role's card from card buttons; each role's action resolves on its card, in this action's window. `message(context, assigned, chooser)` returns a `msg` template |
| `selectCard({ cardCondition?, gameAction, ... })` | Prompt to select one card, then apply `gameAction`; `message: (context, card, chooser) => msg\`…\`` and `subActionProperties` get that card |
| `selectCards({ mode, cardCondition?, gameAction, ... })` | Several cards, by `mode`; `message: (context, cards, chooser)` gets the chosen cards, `subActionProperties` one candidate or all of them |
| `cancel()` | Cancel the triggering event (for interrupts) |
| `handler({ handler })` | Run arbitrary code as an action |
| `noAction()` | No-op |
| `duel({ ... })` | Initiate a duel (see [Duels](#duels)) |
| `conflictLastingEffect({ ... })` | Lasting effect scoped to conflict |

---

## Deck Search

`deckSearch` is one of the most configurable actions.

```typescript
deckSearch({
    cardsToLookAt: -1,             // -1 = entire deck (default), or a number to look at top N
    numCards: 1,                   // how many cards to select
    mode: TargetMode.UpTo,         // Single, UpTo, Exactly, Unlimited
    deck: DeckType.Conflict,      // ConflictDeck or DynastyDeck
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: moveCard({ destination: Location.Hand }),
    takesNothingGameAction: draw(),
    doneButtonText: 'Done',        // the button ending the choice (default "Take nothing", then "Done")
    message: (context, cards, chooser) => msg`${chooser} takes ${cards}`,   // default: "<chooser> takes <cards>" (or "… takes 1 card" unrevealed)
    remainingCards: RemainingCards.Shuffle, // the looked-at cards not taken (default Shuffle)
    reveal: true,                  // reveal selected cards to all
    uniqueNames: false             // prevent selecting two cards with same name
})
```

`takesNothingGameAction` fires when the player picks nothing (chooses "Take nothing").

`remainingCards` decides what happens to the looked-at cards that weren't taken: `Shuffle` (the deck), `Discard`, `Top` (back on top, same order), `TopAnyOrder` (the player orders them) or `BottomRandom`. They are handled right after the choice; with a `selectedCardsHandler`, after any prompt the handler opens (Breaking In chooses a province first, then shuffles). `remainingCardsHandler` replaces it with custom code.

---

## Lasting Effects

Lasting effects are applied via `cardLastingEffect`, `playerLastingEffect`, or `ringLastingEffect`. They take `effect` (one or more effects from `effects.ts`) and `duration`, which defaults to `Duration.UntilEndOfConflict`.

```typescript
.cardLastingEffect((context) => ({
    target: context.targets.target,
    effect: modifyMilitarySkill(2)
}))
```

### Duration

| Constant | Resets |
|----------|--------|
| `Duration.UntilEndOfConflict` | Default — end of current conflict |
| `Duration.UntilEndOfPhase` | End of current phase |
| `Duration.UntilEndOfRound` | End of round |
| `Duration.UntilEndOfDuel` | End of current duel |
| `Duration.UntilPassPriority` | Next time anyone passes priority |
| `Duration.UntilOpponentPassPriority` | Opponent passes priority |
| `Duration.UntilSelfPassPriority` | Controller passes priority |
| `Duration.Persistent` | Never expires (use `persistentEffect`, not a lasting effect) |

Multiple effects can be combined as an array:

```typescript
effect: [
    modifyMilitarySkill(3),
    doesNotBow()
]
```

---

## Effects Reference

Effects are used inside `persistentEffect` and `*lastingEffect`. They are factories — call them with arguments, pass the result to `effect:`.

The authoritative list lives in `server/game/effects.ts`. Tables below cover the common cases — when an effect you expect is missing, grep that file.

### Skill modifiers (card)

| Effect | Description |
|--------|-------------|
| `modifyMilitarySkill(n)` | +N military skill |
| `modifyPoliticalSkill(n)` | +N political skill |
| `modifyBothSkills(n)` | +N both skills |
| `setMilitarySkill(n)` | Set military skill to N |
| `setPoliticalSkill(n)` | Set political skill to N |
| `setBaseMilitarySkill(n)` | Set base (printed) military to N |
| `setBasePoliticalSkill(n)` | Set base (printed) political to N |
| `setBaseDash(type)` | Set a skill to dash |
| `setDash(type)` | Set effective skill to dash |
| `modifyMilitarySkillMultiplier(n)` | Multiply military skill by N |
| `modifyPoliticalSkillMultiplier(n)` | Multiply political skill by N |
| `modifyGlory(n)` | +N glory |
| `setGlory(n)` | Set glory to N |
| `modifyBaseProvinceStrength(n)` | Modify base province strength |
| `modifyProvinceStrength(n)` | +N province strength |
| `setBaseProvinceStrength(n)` | Set base province strength |
| `setProvinceStrength(n)` | Set effective province strength |
| `switchBaseSkills()` | Swap printed mil/pol skills |

### Identity / type changes (card)

| Effect | Description |
|--------|-------------|
| `addTrait(trait)` | Add a trait |
| `loseTrait(trait)` | Remove a trait |
| `addFaction(faction)` | Add a faction |
| `loseFaction(faction)` | Remove a faction |
| `addKeyword(keyword)` | Add a keyword |
| `loseKeyword(keyword)` | Remove a keyword |
| `changeType(type)` | Change card type |
| `blank()` | Blank all non-keyword abilities |
| `loseAllNonKeywordAbilities()` | Remove non-keyword abilities |
| `copyCard(card)` | Copy all abilities from another card |
| `gainAbility.action(title, (ability) => ability…)` | Grant an action, written with the builder (`context.source` is the card that gains it) |
| `gainAbility.reaction(title, when, (ability) => ability…)` | Grant a triggered ability; also `.interrupt`, `.wouldInterrupt`, `.forcedReaction`, `.forcedInterrupt` |
| `gainAbility(AbilityType.Persistent, props)` | Grant a persistent effect; `gainAbility(ability.abilityType, ability)` copies an existing ability |
| `gainAllAbilities(card)` | Copy all abilities from a specific card |
| `takeControl(player)` | Change controller |
| `entersPlayWithStatus(status)` | Card enters play with a token |

### Participation / conflict (card)

| Effect | Description |
|--------|-------------|
| `doesNotBow()` | Character doesn't bow at end of conflict |
| `doesNotReady()` | Character doesn't ready during regroup |
| `cannotParticipateAsAttacker(type)` | Block from conflict as attacker entirely — declaration *and* being moved in (default 'both') |
| `cannotParticipateAsDefender(type)` | Block from conflict as defender entirely (default 'both') |
| `cannotBeDeclaredAsAttacker()` | Block *declaration* only — character can still be moved into the conflict |
| `cannotBeDeclaredAsDefender()` | Block *declaration* only |
| `mustBeDeclaredAsAttacker()` | Must participate as attacker |
| `mustBeDeclaredAsDefender(type)` | Must participate as defender |
| `contributeToConflict(player)` | Allows contributing to specified player's side |
| `cannotBeAttacked()` | Province cannot have conflicts declared against it |
| `participatesFromHome(props)` | Character can trigger abilities even from home |
| `triggersAbilitiesFromHome(props)` | Same — triggers abilities from home |

Match the effect to the card text: *"cannot participate … as an attacker"* → `cannotParticipateAsAttacker()`; *"cannot be **declared** as an attacker"* → `cannotBeDeclaredAsAttacker()`. They differ — `cannotBeDeclaredAs*` only blocks conflict declaration, so effects that *move* a character into a conflict (`moveToConflict`, `putIntoConflict`) bypass it; `cannotParticipateAs*` covers both paths.

### Attachment restrictions (card)

| Effect | Description |
|--------|-------------|
| `attachmentTraitRestriction(traits)` | Only attach to characters with these traits |
| `attachmentFactionRestriction(factions)` | Only attach to these factions |
| `attachmentCardCondition(func)` | Custom attach condition |
| `attachmentMyControlOnly()` | Only attach to own characters |
| `attachmentOpponentControlOnly()` | Only attach to opponent's characters |
| `attachmentUniqueRestriction()` | Card is unique (restrict duplicates) |
| `attachmentLimit(n)` | Max N attachments on parent |
| `cannotHaveOtherRestrictedAttachments(card)` | No other restricted attachments |

### Ability modifications (card)

| Effect | Description |
|--------|-------------|
| `cardCannot({ cannot, appliesTo? })` | Prevent specific actions on a card |
| `immunity({ appliesTo })` | Make card immune to certain effects |
| `increaseLimitOnAbilities(abilities)` | Increase limit max for specified abilities |
| `fateCostToAttack(n)` | Cost N fate to declare card as attacker |
| `honorCostToDeclare(n)` | Cost N honor to declare card |
| `suppressEffects(condition)` | Suppress certain effects on this card |
| `cannotApplyLastingEffects(condition)` | Block lasting effects on this card |
| `honorStatusDoesNotModifySkill()` | Honored/dishonored status doesn't affect skill |
| `honorStatusDoesNotAffectLeavePlay()` | Status tokens don't trigger on leave-play |

### Restrictions: `cardCannot` / `playerCannot`

```ts
cardCannot(RestrictionType.Dishonor)                    // shorthand
cardCannot({ cannot: RestrictionType.ApplyCovert, appliesTo: RestrictionScope.OpponentsCardEffects })
playerCannot({ cannot: RestrictionType.TakeFateFromRings })
```

A restriction names a **`RestrictionType`** (`server/game/Constants/RestrictionType.ts`; a `PlayType` restricts playing that way). It only fires where the engine calls `checkRestrictions(RestrictionType.X, …)` (`server/game/Effects/Restriction.ts`). A restriction without a type (`immunity({ restricts: … })`) forbids everything. **A type only blocks the code paths that check it.** If the prohibition you want spans several game-state paths, a type that's only checked on one of them is an incomplete guard. Prefer a dedicated effect when one exists (e.g. `cannotParticipateAsAttacker()`, which covers every path, over the declaration-only `cannotBeDeclaredAsAttacker()` — see [Participation / conflict](#participation--conflict-card)). Where a type is wrapped by a named helper, call the helper.

The types fall into two groups:

**Game actions** — a `GameAction` that declares a `restriction` (`restriction = RestrictionType.Bow`) checks it in `canAffect`, so a card can be made immune to that action anywhere it would resolve. These are *complete* (they cover every path that runs the action):

`Bow` · `Break` · `Dishonor` · `Honor` · `Discard` · `DiscardFromPlay` · `Sacrifice` · `RemoveFate` · `PlaceFate` · `GainFate` · `SpendFate` (also `loseFate`) · `GainHonor` · `LoseHonor` · `TakeHonor` · `Draw` · `Duel` · `Move` · `MoveToConflict` · `SendHome` · `Ready` · `ReturnToHand` · `ReturnToDeck` · `RemoveFromGame` · `PutIntoPlay` · `RestoreProvince` · `TakeControl` · `TurnFacedown`; `LeavePlay` covers discarding from play, sacrificing, returning to hand or deck and removing from the game. To restrict another game action, add a member and declare it on the action.

**Engine checkpoints** — checked at one or a few specific code sites only. These are *narrow* by nature; know what each guards:

| Type | Guarded at | Does **not** cover |
|------|-----------|--------------------|
| `DeclareAsAttacker` (helper: `cannotBeDeclaredAsAttacker()`) | `canDeclareAsAttacker` (conflict declaration) | being **moved** into the conflict — use `cannotParticipateAsAttacker()` |
| `DeclareAsDefender` (helper: `cannotBeDeclaredAsDefender()`) | `canDeclareAsDefender` | being **moved** in — use `cannotParticipateAsDefender()` |
| `ApplyCovert` | `canBeBypassedByCovert` | — (correct for "cannot be evaded by covert") |
| `Target` | ability targeting | non-targeting effects |
| `Play` / `PlayCharacter` / `EnterPlay` / `PutIntoPlay` / `PutIntoConflict` | the matching play/enter step | — |
| `TriggerAbilities` (helper: `cannotTriggerAbilities()`) | triggered abilities — `isTriggeredAbility()` (Action / Reaction / Interrupt / Forced) | **keyword** abilities (covert, pride, sincerity…) — those go through `InitiateKeywords` |
| `InitiateKeywords` | keyword abilities — `isKeywordAbility()` | triggered abilities |
| `ReceiveDishonorToken` · `ReceiveHonorToken` · `ReceiveTaintedToken` (helpers: `cannotReceive*Token()`) | applying that status token, any source | — |
| `ClaimRings` · `LoseDuels` · `Duel` · `SpendFate` · `TakeFateFromRings` · `HaveImperialFavor` · `HaveAffinity` · `PreventedFromLeavingPlay` · `ApplyEffect` · `ChooseConflictRing` · `ContributeSkillToConflictResolution` · `PlaceFateWhenPlayingCharacter` · `PlaceFateWhenPlayingCharacterFromProvince` | their named checkpoint | — |

`TriggerAbilities` and `InitiateKeywords` are **disjoint categories, not two paths to one outcome** — unlike the declare/participate pair above. *"Cannot trigger abilities"* (the wording on every card using this token) means triggered abilities only; keywords stay live by design. To also suppress keywords, add `cardCannot(RestrictionType.InitiateKeywords)`; to remove abilities entirely, use `blank()` / `loseAllNonKeywordAbilities()`.

`appliesTo:` narrows which attempts the restriction applies to: whose effect or ability (`RestrictionScope.OpponentsCardEffects`, `CardEffects`, `Source`), what kind of card or ability (`Events`, `Reactions`, `KeywordAbilities`), or a circumstance (`LoseHonorAsCost`, `NonDynastyPhase`); the full set is `RestrictionScope` (`server/game/Constants/RestrictionScope.ts`). A trait is written `{ trait: 'maho' }`, and a list applies when all of its entries do. Without `appliesTo`, the restriction applies to every attempt. When the engine *only* blocks one path and you need full coverage, the inverse mistake also exists — see `KuniJuurou.ts`, which deliberately adds `cannotBeDeclaredAsAttacker()` on top of taint because taint blocks participation but "the declaration goes through."

### Player effects

| Effect | Description |
|--------|-------------|
| `reduceCost({ amount, match?, limit? })` | Reduce play cost |
| `increaseCost({ amount, match? })` | Increase play cost |
| `reduceNextPlayedCardCost(n, match)` | Reduce cost of next matching card |
| `additionalAction(n)` | Grant N extra actions this window |
| `additionalConflict(type)` | Grant extra conflict opportunity |
| `additionalCharactersInConflict(n)` | Allow N extra characters in conflict |
| `playerCannot({ cannot, appliesTo? })` | Prevent player from taking an action |
| `cannotDeclareConflictsOfType(type)` | Block conflict type |
| `changePlayerSkillModifier(n)` | Modify player's total conflict skill |
| `modifyHonorTransferGiven(n)` | Modify honor transfers given |
| `modifyHonorTransferReceived(n)` | Modify honor transfers received |
| `gainActionPhasePriority()` | Player has priority this action phase |
| `canPlayFromOwn(location, cards, playType)` | Play cards from non-standard location |
| `showTopConflictCard(players)` | Show top conflict card to player(s) |
| `eventsCannotBeCancelled()` | Events cannot be cancelled |
| `additionalPlayCost(func)` | Add extra cost to playing a card |

### Conflict-scope effects

| Effect | Description |
|--------|-------------|
| `charactersCannot({ cannot })` | All characters cannot do X in the conflict |
| `cannotContribute(func)` | Prevent a card from contributing skill |
| `forceConflictUnopposed()` | Conflict counts as unopposed |
| `restrictNumberOfDefenders(n)` | Limit number of defenders |

### Duel effects

| Effect | Description |
|--------|-------------|
| `modifyDuelistSkill(value, duel?)` | Modify the card's contribution to a duel (optionally scoped to a specific `Duel` instance) |
| `winDuel(duel)` | Force win a duel |
| `winDuelTies()` | Win tied duels |
| `duelIgnorePrintedSkill()` | Ignore printed skill in duel |
| `applyStatusTokensToDuel()` | Status tokens apply to duel |

---

## Duels

Duels are initiated via `initiateDuel` on an action/reaction, or via `duel()`. `initiateDuel` takes a function returning the duel's properties.

```typescript
this.action('Duel target character')
    .initiateDuel(() => ({
        type: DuelType.Military,
        requiresConflict: true,   // default true — source and target must be participating
        challengerCondition: (card, context) => card === context.source,
        targetCondition: (card) => card.isParticipating(),
        gameAction: (duel) => discardFromPlay({ target: duel.loser }),
        chatText: (context, duel) => msg`discard ${duel.loser}`
    }));
```

| Field | Description |
|-------|-------------|
| `type` | `DuelType.Military`, `DuelType.Political`, or `DuelType.Glory` |
| `requiresConflict` | Default `true`. Challenger and target must be participating |
| `challengerCondition` | Filter for who can be the challenger (overrides default participation check on the challenger) |
| `targetCondition` | Filter for legal duel targets (overrides default participation check on the target) |
| `opponentChoosesDuelTarget` | Opponent selects the target |
| `opponentChoosesChallenger` | Opponent selects the challenger |
| `gameAction` | `(duel, context) => GameAction` — the effect resolved when the duel ends. `duel.winner` / `duel.loser` are `DrawCard[]` (empty array on tie) |
| `chatText` | `(context, duel) => msg\`…\`` — the text after "Duel Effect: " in chat; without it, the game action's own effect text |
| `refuseGameAction` | Effect when the opponent legally refuses the duel (consult `Duel.ts`) |
| `refusalMessage` | `(context, refuser) => msg\`…\`` — the chat line when refused; by default "<refuser> chooses to refuse the duel and <refuseGameAction's text>" |
| `costHandler` | Custom focus-cost handler |
| `challengerEffect` / `targetEffect` | Pre-resolution per-side effects |
| `statistic` | `(card, rules) => number` — override skill statistic used in resolution |

When `requiresConflict: true` (default), do not add a redundant `isDuringConflict()` condition or `source.isParticipating()` condition — the duel system enforces both. There is no `winnerHandler`/`loserHandler`/`tieHandler` indirection — express win/loss/tie effects by branching on `duel.winner.length` / `duel.loser.length` inside the single `gameAction` factory.

---

## Constants Reference

Import from `'../Constants.js'` (adjust path for nesting).

### `Phase`
`Setup`, `Dynasty`, `Draw`, `Conflict`, `Fate`, `Regroup`

### `CardType`
`Stronghold`, `Role`, `Province`, `Character`, `Holding`, `Event`, `Attachment`

### `Location`
`Any`, `Hand`, `ConflictDeck`, `DynastyDeck`, `ConflictDiscardPile`, `DynastyDiscardPile`, `PlayArea`, `Provinces` (string value `'province'`, grouping all four slots), `ProvinceOne`–`ProvinceFour`, `StrongholdProvince`, `ProvinceDeck`, `RemovedFromGame`, `UnderneathStronghold`, `OutsideTheGame`, `BeingPlayed`, `Role`

### `Players`
`Self`, `Opponent`, `Any`, `All`

### `Duration`
`UntilEndOfConflict` (default for `cardLastingEffect`), `UntilEndOfPhase`, `UntilEndOfRound`, `UntilEndOfDuel`, `UntilPassPriority`, `UntilOpponentPassPriority`, `UntilSelfPassPriority`, `UntilNextPassPriority`, `Persistent`, `Custom`

### `AbilityType`
`Action`, `Reaction`, `ForcedReaction`, `Interrupt`, `ForcedInterrupt`, `WouldInterrupt`, `KeywordInterrupt`, `KeywordReaction`, `DuelReaction`, `Persistent`, `OtherEffects`

### `ConflictType`
`Military`, `Political`, `Passed`, `Forced`

### `Stage`
`Cost`, `Effect`, `PreTarget`, `Target`

### `TargetMode`
`Single` (default), `UpTo`, `UpToVariable`, `Exactly`, `ExactlyVariable`, `Unlimited`, `MaxStat`, `Ring`, `Select`, `Ability`, `Token`, `ElementSymbol`, `AutoSingle`

### `DuelType`
`Military`, `Political`, `Glory`

### `Element`
`Fire`, `Earth`, `Air`, `Water`, `Void`

### `DeckType`
`ConflictDeck`, `DynastyDeck`

### `CharacterStatus`
`Honored`, `Dishonored`, `Tainted`

### `FavorType`
`Military`, `Political`, `Both`

### `PlayType`
`PlayFromHand`, `PlayFromProvince`, `Other`

### `EventName`
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
.bow((context) => ({ target: context.targets.bow }))
.honor((context) => ({ target: context.targets.honor }))
```

### Give a card a lasting effect for the conflict

```typescript
.cardLastingEffect((context) => ({
    target: context.targets.target,
    effect: [
        modifyMilitarySkill(3),
        doesNotBow()
    ]
}))
```

### Search a deck and put selected card into hand

```typescript
.deckSearch({
    deck: DeckType.Conflict,
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: moveCard({ destination: Location.Hand })
})
```

### Conditional effect (if X then bow, else dishonor)

```typescript
.target({ cardType: CardType.Character })
.if((context) => context.target.isHonored)
    .bow()
.otherwise()
    .dishonor()
```

### Grant an ability while a condition is true (composure example)

```typescript
this.composure({
    effect: gainAbility.action('Draw a card', (ability) => ability
        .condition((context) => context.source.isParticipating())
        .gameAction(draw()))
});
```

### Reduce cost of next matching card

```typescript
.playerLastingEffect((context) => ({
    targetController: context.player,
    effect: reduceNextPlayedCardCost(1, (card) => card.hasTrait('shugenja'))
}))
```

### Reaction from discard pile

```typescript
this.reaction('Shuffle back into deck')
    .when({
        onCardLeavesPlay: (event, context) => event.card === context.source
    })
    .location(Location.DynastyDiscardPile)   // fire from discard, not play
    .gameAction(moveCard({
        destination: Location.DynastyDeck,
        shuffle: true
    }));
```

### Chain a follow-up prompt with `then`

`then()` starts the next step, declared with the same methods; its context still holds the targets chosen so far.

```typescript
this.action('Bow, then choose an effect')
    .target({
        cardType: CardType.Character
    }, bow())
    .then()
    .select({}, {
        'Gain 1 honor': gainHonor(),
        'Draw 1 card': draw()
    });
```

---

## Tips for New Card Designers

**`condition` vs `cardCondition`**

- `.condition((context) => bool)` gates the entire ability — if it returns `false`, the ability can't be used.
- `cardCondition: (card, context) => bool` on a target filters which individual cards are legal targets.

**`isParticipating()` implies a conflict**

If any `cardCondition` or `condition` checks `card.isParticipating()`, you don't need `context.game.isDuringConflict()` — the participation check already implies a conflict is active.

**`requiresConflict` and duels**

`initiateDuel` with `requiresConflict: true` (the default) already ensures a conflict is ongoing and that both challenger and target are participating. Don't add a duplicate `isDuringConflict()` condition or `source.isParticipating()` check — the duel helper enforces them.

**One target or several**

Call `target` once for a single selection, and once per selection when you need several distinct ones (e.g., choose one character to bow and a different one to honor). A later target can depend on an earlier one via `dependsOn`. Use `targetCards` for one selection of several cards.

**`multiple` vs `sequential`**

`multiple([...])` resolves all actions simultaneously — effects are applied together. `sequential([...])` queues actions one by one. Use `sequential` when the second action depends on the result of the first.

**Effect targeting: `match` vs `target`**

In `persistentEffect`, `match: (card) => bool` filters which cards are continuously affected. In `cardLastingEffect`, `target:` is the card you're applying it to right now.
