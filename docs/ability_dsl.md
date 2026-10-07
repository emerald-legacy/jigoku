# Ability DSL Reference

This document describes the ability DSL used to implement card effects. All APIs are grouped under `AbilityDsl` (`server/game/abilitydsl.ts`). Cards import game actions and effects by name (see below) and use `AbilityDsl` for costs and limits.

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

Game actions and effects are also named exports, so a card can import what it uses instead of `AbilityDsl`:

```typescript
import { bow, cardLastingEffect } from '../../GameActions/GameActions.js';
import { modifyMilitarySkill } from '../../effects.js';
```

Prefer the named imports in new code. Costs and limits stay under `AbilityDsl` (cost names such as `bow` and `dishonor` clash with the actions). The only effect and action sharing a name is `takeControl`; import one of them with `as`.

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
    .phase(Phases.Conflict)
    .condition((context) => context.source.isParticipating())
    .cost(AbilityDsl.costs.bowSelf())
    .target({
        cardType: CardType.Character,
        cardCondition: (card) => card.isParticipating()
    }, bow())
    .limit(AbilityDsl.limit.perConflict(1))
    .effect('bow {0}');
```

The builder fixes its types from left to right: each call sees what earlier calls declared. Declare targets and costs before the `gameAction`, `handler`, `effect` and `then` that read them.

Builder methods shared by actions and triggered abilities:

| Method | Description |
|--------|-------------|
| `cost(cost)` | A cost to pay before resolving (see [Costs](#costs)). Call once per cost. Costs that record a result put it in `context.costs`, typed but optional (it is only set once paid) |
| `target(props, ...actions)` | A card target (see [Targets](#targets)) |
| `targetCards(props, ...actions)` | Several cards, by `mode` |
| `ringTarget(props, ...actions)` | A ring target |
| `select(props, choices)` / `selectIf` / `selectFrom` | A choice between labelled options; a `select` choice is a game action, or a condition for a choice that does nothing (`No: () => true`) |
| `tokenTarget` / `abilityTarget` / `elementTarget` | Status tokens, a printed ability, an element symbol on a chosen card |
| `gameAction(...actions)` | Action(s) to resolve (see [Game Actions](#game-actions)) |
| `handler(fn)` | Low-level handler called after costs are paid (use `gameAction` when possible) |
| `effect(message, args?)` | Chat log message. `{0}` = the target (or source), `{1}` onwards = the entries of `args(context)` |
| `then()` | Starts the next step ("Then, …"), declared with the same methods; its context holds the targets chosen so far |
| `thenIf(fn)` | Starts the next step when `fn(context)` holds once this step resolved ("Then, if …") |
| `thenAlways()` | Starts the next step even when this step didn't resolve in full |
| `message(fn)` | A step's message: `fn(context)` returns a `msg` template, or `undefined` for none |
| `mayResolveTwice({ cost?, label?, condition? })` | "You may [pay] to resolve this ability twice": the player may pay `cost` (button "{label} to resolve this ability again") to resolve it again; on the second resolution the cost is offered "for no effect". Without a cost, a Yes/No question |
| `opponentMayResolveAgain(prompt)` | "Then, your opponent may resolve this ability" |
| `onResolve(fn)` | Runs `fn(context)` when the ability starts resolving its effects (bookkeeping: counting uses, remembering a target) |
| `onAffinity(element, { prompt?, effect? })` | "With [element] affinity": the ability's or step's game actions resolve only with that affinity. `prompt` asks Yes/No first; `effect(context)` is a `msg` template for the chat line "{player} channels their {element} affinity to …" (by default the actions' own text) |
| `if(fn)`, `otherwise()` | "If …, otherwise …": the game actions after `if()` resolve when `fn(context)` holds, the ones after `otherwise()` (optional) when it doesn't. Targets go before `if()`; right after a card target without game actions, the branches are that target's (they resolve on the chosen card). Branch lines are indented one level deeper |
| `gainHonor(n)`, `loseHonor(n)`, `gainFate(n)`, `draw(n)` | The player of the ability gains honor, loses honor, gains fate, draws cards; `n` defaults to 1 |
| `ready(props?)`, `bow`, `honor`, `dishonor`, `placeFate`, `removeFate`, `sendHome`, `moveToConflict`, `discardFromPlay`, `sacrifice`, `takeHonor`, `takeFate`, `refillFaceup(props)`, `cardLastingEffect(props)`, `playerLastingEffect(props)` | Shortcuts for `gameAction(x(props))`: the same properties as the factory, or a function of the context returning them; `gameAction()` takes any other action |
| `initiateDuel(fn)` | Wires a duel as the ability's effect (see [Duels](#duels)) |
| `limit(limit)` / `max(limit)` | Usage limit (see [Limits](#limits)) |
| `location(location)` | Where the card must be to use the ability. Default: the hand for events, the provinces for provinces and holdings, the stronghold province for strongholds, otherwise the play area |
| `cannotTargetFirst()` | Skip PreTarget early-target resolution — targets are resolved only after costs (`Stage.Target`) |
| `cannotBeMirrored()` | The Mirror's Gaze can't copy it |
| `evenDuringDynasty()` | Allow triggering during the Dynasty phase without the default per-type restrictions |
| `notPrinted()` | Not printed on the card, so effects that copy or count printed abilities skip it |
| `anyPlayer()` | Either player may trigger it (default: only the controller) |

Action-only methods:

| Method | Description |
|--------|-------------|
| `condition(fn)` | Extra gate — the ability only appears if `fn(context)` returns `true` |
| `phase(phase)` | Phase restriction. Default `'any'`. During the Dynasty phase, only Holding/Character/Attachment cards (or `evenDuringDynasty()`, or events allowed by `dynastyPhaseCanPlayConflictEvents`) may trigger |
| `canTriggerOutsideConflict()` | Province actions can fire when no conflict is active |
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
    .gameAction(gainHonor())
    .limit(AbilityDsl.limit.perRound(1));
```

Triggered abilities also have `collectiveTrigger()`: trigger once for events that happen together.

### `this.interrupt(title)`

Interrupt fires before the triggering event resolves. Useful for cancels and redirections.

```typescript
this.interrupt('Gain 1 fate')
    .when({
        onCardLeavesPlay: (event, context) => event.card === context.source
    })
    .gameAction(gainFate());
```

### Forced variants

`this.forcedReaction(title)` and `this.forcedInterrupt(title)` fire automatically — the player cannot opt out. Used for mandatory effects (e.g., "when X happens, you must Y").

### `this.wouldInterrupt(title)`

Fires "before" the triggering event is queued at all. Used for "would" effects — prevention or modification before the event happens. The context has a `cancel()` method for these.

```typescript
this.wouldInterrupt('Cancel a duel')
    .when({
        onDuelInitiated: (event, context) => !!event.context && event.context.player === context.player.opponent
    })
    .handler((context) => context.cancel())
    .effect('cancel the duel');
```

The constant `AbilityType.WouldInterrupt` has the string value `'cancelinterrupt'` for historical reasons.

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
| `effect` | One or more effect factory results from `AbilityDsl.effects` |

### `this.composure(props)`

Sugar for `persistentEffect` with `condition: context.player.hasComposure()`. Active while the controller has composure.

```typescript
this.composure({
    effect: gainAbility(AbilityType.Action, { ... })
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

The choices object maps button labels to game actions. A choice is shown only if its action has a legal target. `selectIf` takes conditions `(context) => boolean` instead, for a handler that reads `context.select`; `selectFrom` takes a function returning the choices, when they depend on the context.

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

Inside any ability callback (`condition`, `handler`, `effect` arguments, `when`, `cardCondition`, a `then` factory, etc.) `context.source` is typed to **the card's own class** — for a card that `extends DrawCard`, `context.source` is a `DrawCard`, so its members are accessible with no cast:

```typescript
this.action('Move to the conflict')
    .condition((context) => context.source.isParticipating())   // DrawCard member, no cast
    .gameAction(moveToConflict());
```

The same applies to `AbilityDsl.effects.gainAbility(...)`: the granted ability's `context.source` defaults to `DrawCard`.

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
    .effect('bow {0}');
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
    .gameAction(gainFate());
```

Narrow on `context.event.name` (or `context.event.is(EventName.X)`) when you need a field specific to one event.

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
| `limit.fixed(n)` | Never resets — N uses total per game |
| `limit.perGame(n)` | Never resets — alias for `fixed` with explicit name |
| `limit.perRound(n)` | Each round ends |
| `limit.perConflict(n)` | Each conflict ends |
| `limit.perConflictOpportunity(n)` | Conflict ends or player passes a conflict |
| `limit.perPhase(n)` | Each phase ends |
| `limit.perDuel(n)` | Each duel ends |
| `limit.unlimitedPerConflict()` | Each conflict ends (unlimited uses within) |
| `limit.unlimited()` | Never at max — truly unlimited |
| `limit.repeatable(n, eventName)` | On a specific `EventName` |

Both `limit:` and `max:` on an ability accept a limit object. They are equivalent.

---

## Game Actions

Game actions are called via `AbilityDsl.actions`. All accept an optional `propertyFactory`: either a plain properties object or `(context) => properties`. The `target` property inside the factory sets which card/player is affected.

When no `target` is provided, card actions target `context.source`, player actions target the ability's player (the opponent for lose, take and discard actions), `amount` is 1, and a target's own action targets the chosen card. Composite actions (`multiple`, `sequential`, `conditional`, `selectCard`, …) pass their own target down to their children instead, so a player action inside one still names its player.

Every factory also takes an optional `<Target extends BaseCard>` type parameter, so the `context` inside a `(context) => properties` factory is typed the same way as the ability's target (see [Typed Targets & Events](#typed-targets--events-typescript)):

```typescript
gameAction: cardLastingEffect<DrawCard>((context) => ({
    target: context.target,   // DrawCard | undefined — no cast
    effect: modifyMilitarySkill(2)
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
| `actions.cardLastingEffect({ effect, duration? })` | source | Apply a lasting effect to specific cards |

### Player actions

These target the ability's player, except `takeFate`, `takeHonor`, `chosenDiscard`, `chosenReturnToDeck`, `discardAtRandom` and `discardMatching`, which target the opponent.

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
| `actions.chooseAction({ options, activePromptTitle? })` | Prompt player to choose between actions; `options` maps each label to `{ action, message? }` |
| `actions.menuPrompt({ ... })` | Show a free-form menu prompt |
| `actions.rearrangeDeck({ amount, deck?, activePromptTitle?, message? })` | The player of the ability puts the top `amount` cards of the target player's `deck` (default: their own conflict deck) back in the order they choose, one prompt per position |
| `actions.assignRoles({ roles, player?, pick?, activePromptTitle?, message? })` | Two cards, two roles (`{ Honor: honor(), Dishonor: dishonor() }`): the chooser gives each card a role, by role then card, or with `pick` by picking that role's card from card buttons; each role's action resolves on its card, in this action's window. `message(assigned, context)` returns a `msg` template |
| `actions.selectCard({ cardCondition?, gameAction, ... })` | Prompt to select one card, then apply `gameAction`; `messageArgs` and `subActionProperties` get that card |
| `actions.selectCards({ mode, cardCondition?, gameAction, ... })` | Several cards, by `mode`; `messageArgs` gets the chosen cards, `subActionProperties` one candidate or all of them |
| `actions.cancel()` | Cancel the triggering event (for interrupts) |
| `actions.handler({ handler })` | Run arbitrary code as an action |
| `actions.noAction()` | No-op |
| `actions.duel({ ... })` | Initiate a duel (see [Duels](#duels)) |
| `actions.conflictLastingEffect({ ... })` | Lasting effect scoped to conflict |

---

## Deck Search

`actions.deckSearch` is one of the most configurable actions.

```typescript
deckSearch({
    amount: -1,                    // -1 = entire deck (default), or a number to look at top N
    numCards: 1,                   // how many cards to select
    targetMode: TargetMode.UpTo,  // Single, UpTo, Exactly, Unlimited
    deck: Decks.ConflictDeck,      // ConflictDeck or DynastyDeck
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: moveCard({ destination: Location.Hand }),
    takesNothingGameAction: draw(),
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

Lasting effects are applied via `actions.cardLastingEffect`, `actions.playerLastingEffect`, or `actions.ringLastingEffect`. They take `effect` (one or more `AbilityDsl.effects` values) and `duration`, which defaults to `Duration.UntilEndOfConflict`.

```typescript
gameAction: cardLastingEffect((context) => ({
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
| `effects.cannotParticipateAsAttacker(type)` | Block from conflict as attacker entirely — declaration *and* being moved in (default 'both') |
| `effects.cannotParticipateAsDefender(type)` | Block from conflict as defender entirely (default 'both') |
| `effects.cannotBeDeclaredAsAttacker()` | Block *declaration* only — character can still be moved into the conflict |
| `effects.cannotBeDeclaredAsDefender()` | Block *declaration* only |
| `effects.mustBeDeclaredAsAttacker()` | Must participate as attacker |
| `effects.mustBeDeclaredAsDefender(type)` | Must participate as defender |
| `effects.contributeToConflict(player)` | Allows contributing to specified player's side |
| `effects.cannotBeAttacked()` | Province cannot have conflicts declared against it |
| `effects.participatesFromHome(props)` | Character can trigger abilities even from home |
| `effects.triggersAbilitiesFromHome(props)` | Same — triggers abilities from home |

Match the effect to the card text: *"cannot participate … as an attacker"* → `cannotParticipateAsAttacker()`; *"cannot be **declared** as an attacker"* → `cannotBeDeclaredAsAttacker()`. They differ — `cannotBeDeclaredAs*` only blocks conflict declaration, so effects that *move* a character into a conflict (`moveToConflict`, `putIntoConflict`) bypass it; `cannotParticipateAs*` covers both paths.

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

### Restrictions: `cardCannot` / `playerCannot`

```ts
effects.cardCannot('dishonor')                                  // shorthand
effects.cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
effects.playerCannot({ cannot: 'initiateConflict' })
```

A restriction names an **action token**. It only fires where the engine calls `checkRestrictions('<token>', …)` with that **exact** string (`server/game/Effects/Restriction.ts`). There is **no validation** that the token is meaningful — `cardCannot('declareAsAttakcer')` (typo) or a token the engine never checks compiles and silently does nothing. Two things follow:

1. **Spell the token correctly** — there is no compile-time or runtime safety net.
2. **A token only blocks the code paths that check it.** If the prohibition you want spans several game-state paths, a token that's only checked on one of them is an incomplete guard. Prefer a dedicated effect when one exists (e.g. `cannotParticipateAsAttacker()`, which covers every path, over the declaration-only `cannotBeDeclaredAsAttacker()` — see [Participation / conflict](#participation--conflict-card)). Where a token is wrapped by a named helper, call the helper rather than retyping the string.

Valid tokens come from two sources:

**Game-action names** — every `GameAction` calls `target.checkRestrictions(this.name, …)` in `canAffect`, so a card can be made immune to that action anywhere it would resolve. These are *complete* (they cover every path that runs the action):

`bow` · `break` · `dishonor` · `honor` · `discard` · `discardFromPlay` · `removeFate` · `placeFate` · `gainFate` · `takeFate` · `takeHonor` · `draw` · `move` · `moveToConflict` · `sendHome` · `ready` · `taint` · `sacrifice` · `attach` · `detach` · `returnToHand` · `returnToDeck` · `putIntoPlay` · `putInProvince` · `turnFacedown` · `takeControl` · `receiveHonorToken` · `receiveDishonorToken` · `receiveTaintedToken` · `removeFromGame` … (full set = the `name` fields in `server/game/GameActions/*.ts`)

**Engine checkpoint tokens** — checked at one or a few specific code sites only. These are *narrow* by nature; know what each guards:

| Token | Guarded at | Does **not** cover |
|-------|-----------|--------------------|
| `declareAsAttacker` (helper: `cannotBeDeclaredAsAttacker()`) | `canDeclareAsAttacker` (conflict declaration) | being **moved** into the conflict — use `cannotParticipateAsAttacker()` |
| `declareAsDefender` (helper: `cannotBeDeclaredAsDefender()`) | `canDeclareAsDefender` | being **moved** in — use `cannotParticipateAsDefender()` |
| `applyCovert` | `canBeBypassedByCovert` | — (correct for "cannot be evaded by covert") |
| `target` | ability targeting | non-targeting effects |
| `play` / `playCharacter` / `enterPlay` / `putIntoPlay` / `putIntoConflict` | the matching play/enter step | — |
| `triggerAbilities` (helper: `cannotTriggerAbilities()`) | triggered abilities — `isTriggeredAbility()` (Action / Reaction / Interrupt / Forced) | **keyword** abilities (covert, pride, sincerity…) — those go through `initiateKeywords` |
| `initiateKeywords` | keyword abilities — `isKeywordAbility()` | triggered abilities |
| `receiveDishonorToken` · `receiveHonorToken` · `receiveTaintedToken` (helpers: `cannotReceive*Token()`) | applying that status token, any source | — |
| `claimRings` · `loseDuels` · `duel` · `spendFate` · `takeFateFromRings` · `haveImperialFavor` · `haveAffinity` · `preventedFromLeavingPlay` | their named checkpoint | — |

`triggerAbilities` and `initiateKeywords` are **disjoint categories, not two paths to one outcome** — unlike the declare/participate pair above. *"Cannot trigger abilities"* (the wording on every card using this token) means triggered abilities only; keywords stay live by design. To also suppress keywords, add `cardCannot('initiateKeywords')`; to remove abilities entirely, use `blank()` / `loseAllNonKeywordAbilities()`.

`restricts:` narrows *whose* effects the restriction applies to (e.g. `opponentsCardEffects`, `cardEffects`, `abilities`); the full set of source-filters is the keys of `checkRestrictions` in `Restriction.ts`. When the engine *only* blocks one path and you need full coverage, the inverse mistake also exists — see `KuniJuurou.ts`, which deliberately adds `cannotBeDeclaredAsAttacker()` on top of taint because taint blocks participation but "the declaration goes through."

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

Duels are initiated via `initiateDuel` on an action/reaction, or via `actions.duel()`. `initiateDuel` takes a function returning the duel's properties.

```typescript
this.action('Duel target character')
    .initiateDuel(() => ({
        type: DuelType.Military,
        requiresConflict: true,   // default true — source and target must be participating
        challengerCondition: (card, context) => card === context.source,
        targetCondition: (card) => card.isParticipating(),
        gameAction: (duel) => discardFromPlay({ target: duel.loser }),
        message: 'discard {0}',
        messageArgs: (duel) => [duel.loser]
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

### `CardType`
`Stronghold`, `Role`, `Province`, `Character`, `Holding`, `Event`, `Attachment`

### `Location`
`Any`, `Hand`, `ConflictDeck`, `DynastyDeck`, `ConflictDiscardPile`, `DynastyDiscardPile`, `PlayArea`, `Provinces` (string value `'province'`, grouping all four slots), `ProvinceOne`–`ProvinceFour`, `StrongholdProvince`, `ProvinceDeck`, `RemovedFromGame`, `UnderneathStronghold`, `OutsideTheGame`, `BeingPlayed`, `Role`

### `Players`
`Self`, `Opponent`, `Any`

### `Duration`
`UntilEndOfConflict` (default for `cardLastingEffect`), `UntilEndOfPhase`, `UntilEndOfRound`, `UntilEndOfDuel`, `UntilPassPriority`, `UntilOpponentPassPriority`, `UntilSelfPassPriority`, `UntilNextPassPriority`, `Persistent`, `Custom`

### `AbilityType`
`Action`, `Reaction`, `ForcedReaction`, `Interrupt`, `ForcedInterrupt`, `WouldInterrupt` (string value `'cancelinterrupt'`), `KeywordInterrupt`, `KeywordReaction`, `DuelReaction`, `Persistent`, `OtherEffects`

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

### `Decks`
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
gameAction: multiple([
    bow((context) => ({ target: context.targets.bow })),
    honor((context) => ({ target: context.targets.honor }))
])
```

### Give a card a lasting effect for the conflict

```typescript
gameAction: cardLastingEffect((context) => ({
    target: context.targets.target,
    effect: [
        modifyMilitarySkill(3),
        doesNotBow()
    ]
}))
```

### Search a deck and put selected card into hand

```typescript
gameAction: deckSearch({
    deck: Decks.ConflictDeck,
    cardCondition: (card) => card.hasTrait('spell'),
    gameAction: moveCard({ destination: Location.Hand })
})
```

### Conditional effect (if X then bow, else dishonor)

```typescript
gameAction: conditional({
    condition: (context) => context.targets.target.isHonored,
    trueGameAction: bow(),
    falseGameAction: dishonor()
})
```

### Grant an ability while a condition is true (composure example)

```typescript
this.composure({
    effect: gainAbility(AbilityType.Action, {
        title: 'Draw a card',
        condition: (context) => context.source.isParticipating(),
        gameAction: draw()
    })
});
```

### Reduce cost of next matching card

```typescript
gameAction: playerLastingEffect((context) => ({
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

The follow-up ability is a properties object (`gameAction`, `target`, `handler`, `message`/`messageArgs`, `thenCondition`, `then`), returned by the function passed to `then`. It resolves with its own context: read the first ability's targets from the outer `context`.

```typescript
this.action('Bow, then choose an effect')
    .target({
        cardType: CardType.Character
    }, bow())
    .then(() => ({
        target: {
            mode: TargetMode.Select,
            choices: {
                'Gain 1 honor': gainHonor(),
                'Draw 1 card': draw()
            }
        }
    }));
```

---

## Tips for New Card Designers

**`condition` vs `cardCondition`**

- `condition: (context) => bool` on the top-level ability gates the entire ability — if it returns `false`, the button doesn't appear.
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
