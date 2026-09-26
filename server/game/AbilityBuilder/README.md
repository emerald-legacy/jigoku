# Ability builder

A fluent API to write card abilities. The goal: card code reads like the card text, with typed costs, targets and events, and no casts.

The builder is an **adapter**. It records the builder calls, then compiles them into the same props that `this.action({...})`, `this.reaction({...})` and `this.persistentEffect({...})` take, and registers them in the old way. The engine does not change. Old and new cards work side by side.

```ts
// Shameful Display: "Action: During a conflict at this province, choose 2 participating characters –
// honor one of those characters and dishonor the other."
this.ability
    .conflictAction()
    .title('Dishonor/Honor two characters')
    .targets(($target) => ({
        characters: $target.cards('character', { exactly: 2, filter: (card) => card.isParticipating() })
    }))
    .announce(($message, ctx) => $message.withIntro`change the personal honor of ${ctx.targets.characters}`)
    .effects(($effect, ctx) => [
        $effect.assign(ctx.targets.characters, {
            honor: (card) => $effect.honor(card),
            dishonor: (card) => $effect.dishonor(card)
        })
    ])
    .addPrinted();
```

## Rules

1. **An ability depends only on `ctx`.** Do not read `this`, instance fields, or shared action objects in callbacks. Abilities are copied (gained abilities, The Mirror's Gaze) and resolved again.
2. **Callbacks are repeatable and have no side effects.** The engine runs them many times: for legality, for messages, and to resolve.
3. **No `Constants` in card code.** Use values (a `Player`, an array of cards) or methods.
    - 2 alternatives or fewer: methods (`util.onEnemySide`, `$effect.takeFate`).
    - 3 alternatives: methods, unless more options are likely.
    - 4 alternatives or more: a string-literal alias, never an `enum` (`'character'`, `until: 'conflict'`).
    - A choice that changes the other parameters or the result type is always a method (the entry points).
4. **Kits build things.** Callbacks get kits as parameters, so card files import only their base class.

## Entry points (`this.ability`)

| Entry point                                                                                                  | Card text                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action()`                                                                                                   | **Action:**                                                                                                                                                                                          |
| `conflictAction()`, `militaryConflictAction()`, `politicalConflictAction()`                                  | **Conflict Action:**, with the RRG meaning for the card type (character: participating; attachment: attached character participating; province: conflict at this province; other: during a conflict) |
| `reaction(when)`, `forcedReaction(when)`, `interrupt(when)`, `wouldInterrupt(when)`, `forcedInterrupt(when)` | **Reaction:**, **Interrupt:**, …                                                                                                                                                                     |
| `duelChallenge()`, `duelFocus()`, `duelStrike()`                                                             | **Duel Challenge:**, … (`ctx.duel` is the duel that resolves)                                                                                                                                        |
| `constant()`, `composure()`, `dire()`                                                                        | a constant ability; the keyword ones keep working under "loses all non-keyword abilities"                                                                                                            |
| `whenever(condition)`                                                                                        | "If X, do Y" without a timing word (Hantei XXXVIII: "If an opponent has the Imperial Favor, discard this character.")                                                                                |
| `playOnlyIf(condition)`                                                                                      | "Play only if …". The check uses the player who plays the card, so it also works when an opponent plays it                                                                                           |

`when` is an object with event names as keys. The event parameter is typed from the key, and `ctx.event` is typed in all later callbacks. A `when` function can return an object instead of `true`; that object is `ctx.matched`.

With several triggers, `ctx.event` is the union of the events. Return the matched card from each trigger, so the effects do not depend on which event fired:

```ts
// Let Him Go By: "After a character controlled by an opponent is played into a conflict or moved to a conflict – bow it."
this.ability
    .reaction({
        onMoveToConflict: (event, ctx) => (event.card.controller === ctx.opponent ? event.card : undefined),
        onCardPlayed: (event, ctx) =>
            event.card.controller === ctx.opponent && event.card.isParticipating() ? event.card : undefined
    })
    .effects(($effect, ctx) => [$effect.bow(ctx.matched)])   // ctx.matched: DrawCard
    .addPrinted();
```

The same works for `interrupt`, `wouldInterrupt` and the forced versions.

For a printed "Conflict Action", the card with the text gives the meaning. For a gained ability, the card that gains it gives the meaning.

## Triggered abilities

### Order of the calls

```
entry
  -> .title() .condition() .from() .duringPhase()       (setup, any order)
  -> .costs() or .costsBeforeTargets()                  (once)
  -> .targets()                                         (repeatable)
  -> .announce()                                        (optional, before the effects)
  -> .effects()
  -> .then() / .ifYouDo() / .thenIf()  -> step: .targets()* .announce()? .effects()?
       .otherwise()                                     (only after .ifYouDo() or .thenIf())
  -> .addPrinted(($limit) => ({ limit?, max? }))        or .build() for a gained ability
```

Each builder step is its own interface, so the compiler rejects a wrong order.

### Costs and targets

- `.costs(($cost) => ({ name: $cost.x(...) }))` gives `ctx.costs.name`. In target filters the costs can be unpaid, so they are `Partial`.
- `.costsBeforeTargets(...)` pays the costs first (RRG steps 4 and 5). Target filters then see paid costs. Without an argument, only the fate cost of the card is paid first.
- `ctx.timesResolved(period)` counts the uses of this ability by the player in the period (`'conflict'`, `'phase'`, `'round'`, `'game'`). A use counts once its costs are paid, so a cost sees the earlier uses and the announcement also sees this one. The count restarts when the card changes zones (RRG: a new instance of the card). Isawa Hifumi: `$cost.fateFromCharacters((ctx) => ctx.timesResolved('round'))`.
- `.targets(($target) => ({ name: $target.x(...) }))` gives `ctx.targets.name`.
    - Slots in one call are independent. A later call depends on the earlier calls (For Shame!: first the character, then the opponent's choice).
    - All target choices happen before the dash, in the same timing step.
- Card targets use a kind: `$target.card('character', …)` gives a `DrawCard`, `'province'` gives a `ProvinceCard`. Multi-card targets are always arrays.
- `from: (ctx, util) => cards` chooses from those cards (a discard pile, outside the game). Leave it out for cards in play.
- `controller` and `chooser` take a `Player` or a function that returns one, for example an earlier target (Levy: `chooser: (ctx) => ctx.targets.opponent`).
- `$target.opponent()` is "choose an opponent". With one opponent, no player chooses; the ability needs an opponent.
- `$target.number({ min, max })` is "choose a number" before the dash.
- `$target.inPlayerOrder((player, $target) => …)` is "each player in turn order chooses". Use `optionalCard` for "may choose". The result is in turn order, so the effects can use the position ("ready the first chosen character, honor the second").
- `$target.select({ options: { key: 'Label' } })` gives the typed key. An option is legal when the effects with that option can change the game state. Put the effect that depends on the option in `$effect.forChoice(ctx.targets.key, { … })`: then only that effect decides, and the other effects in the list do not make every option legal (Levy: the draw does not make "give 1 fate" legal when the opponent has no fate).

### Effects

- `.effects(($effect, ctx, util) => [...])`: all effects in the list resolve at the same time, in one window.
- In `.effects()`, `ctx.costs` is `Partial`: the engine also runs the effects before the costs are paid, to check the ability can change the game state.
- `$effect` helpers accept `undefined` and empty arrays; they then do nothing.
- A chosen card that an effect targets directly must be affectable by it (RRG "Target"). Other chosen cards are references.
- Some building blocks: `if`, `ifAble(...).otherwise(...)`, `forChoice`, `may`, `mayPay`, `resolveThisAbility`, `assign`, `instead`, `cancel`, `delayed`, `eachTime`, `lastingEffect`, `chooseRing`, `chooseNumber`, `playAsIfFromHand`. See `kits/EffectKit.ts`.
- `$effect.may` and `$effect.mayPay` ask when their own effect resolves, after the effects before them in the list apply.
- `$effect.resolveThisAbility` resolves the card ability, also from a "then" step (Hand to Hand: "Then, your opponent may resolve this ability.").
- `$effect.assign(cards, roles, { chooser?, pick?, announce? })`: with `pick`, the chooser picks the card for that role from card buttons, and the other card gets the other role (Nightingale Tattoo).
- `$effect.instead([...])` is a replacement effect. The replacement can affect any card, for example the source (Akodo Kaede: "remove 1 fate from this character instead").
- `$effect.shuffleIntoDeck` and `$effect.removeFromGame` work on cards where they are now (a discard pile, a deck, play).

### "Then" steps

| Builder                              | Card text      | Condition                                          |
| ------------------------------------ | -------------- | -------------------------------------------------- |
| `.then()`                            | "Then, …"      | always (RRG "Effects": "then" only sets the order) |
| `.ifYouDo()`                         | "If you do, …" | the earlier step resolved in full                  |
| `.thenIf(($effect, ctx, util) => …)` | "Then, if …"   | the condition when the step starts                 |
| `.otherwise()`                       | "Otherwise, …" | the opposite branch                                |

A later step sees all earlier targets. Slot names must be unique in the ability.

### Duels

The characters of a duel are targets (RRG "Duel", D.1). A duel is a target plus an effect:

```ts
.targets(($target) => ({ duel: $target.politicalDuel({ challenged: { chooser: (ctx) => ctx.opponent } }) }))
.effects(($effect, ctx) => [
    $effect.resolveDuel(ctx.targets.duel, (outcome) => [$effect.removeFate(outcome.loser)], {
        announce: ($message, outcome) => $message.freeform`remove a fate from ${outcome.loser}`
    })
])
```

- When the ability is on a character, that character is the challenger and is not chosen.
- Both characters must be participating. `challenged: { anyLocation: true }` is "a character … at any location".
- `outcome.winner` and `outcome.loser` are arrays, empty on a tie.
- Options: `statistic` ("using base military skill"), `duelistModifiers` ("giving each dueling character +1…"), `announce` (prints "Duel Effect: <text>").
- `$effect.militaryDuel(challenger, challenged, consequences)` is for a duel that starts in the effect ("your character challenges…").

### Messages

- `.announce(($message, ctx) => …)` prints when its step starts, after costs and targets, before effects.
- `$message.withIntro` gives "{player} plays {source}, paying …, to <text>". `$message.freeform` gives the text as written. `$message.none()` prints nothing; in an array it is skipped.
- The first step must start with `withIntro`. Without `.announce()`, the first step gets a generated message, and later steps print nothing.
- A choice made while an effect resolves is not known when the step starts. Its message belongs to the building block (for example the `announce` option of `$effect.chooseRing`).

## Constant abilities

```ts
this.ability
    .constant()
    .while((ctx, util) => …)
    .appliesTo(($subject) => $subject.attachedCharacter())
    .modifiers(($modifier) => [$modifier.blank()])
    .addPrinted();
```

- Subjects: `self`, `attachedCharacter`, `cards(kind, { in, controller, filter })`, `you`, `opponent`, `eachPlayer`, `conflict`.
- `this.ability.playOnlyIf((ctx, util) => …)` is "Play only if …". It is a constant restriction on the card; its check gets the context of the play.
- Modifiers are typed by the subject: card, player and conflict modifiers cannot mix.
- `$modifier.gainAbility(($ability) => $ability.conflictAction()….build())` gives an ability to the subject. Its `ctx.source` is the card that gains it.
- Printed keywords come from the card text; card code does not declare them.

## Kits and `util`

| Parameter   | Builds                                              |
| ----------- | --------------------------------------------------- |
| `$cost`     | costs                                               |
| `$target`   | targets                                             |
| `$message`  | announcements                                       |
| `$effect`   | effects                                             |
| `$subject`  | what a constant ability applies to                  |
| `$modifier` | modifiers of constant abilities and lasting effects |
| `$payment`  | payments of `$effect.mayPay`                        |
| `$limit`    | limits and maxes                                    |
| `$ability`  | gained abilities                                    |

`util` is always the last parameter. It only answers questions: `onOwnSide`, `onEnemySide`, `militarySkill`, `politicalSkill`, `outnumbered`, `is(card, kind)`, …. It never builds, prompts or picks at random. Add a helper to `util` when two or more cards compute the same thing by hand.

## Files

| File                          | Contents                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `index.ts`                    | the entry points, and the registration of compiled props                                                         |
| `TriggeredBuilder.ts`         | the triggered builder interfaces, and the recorder of the calls                                                  |
| `ConstantBuilder.ts`          | constant abilities, `whenever`, the subject kit                                                                  |
| `types.ts`                    | the builder state, the contexts, the shared types                                                                |
| `view.ts`                     | the typed `ctx`: getters over the live old contexts                                                              |
| `Utils.ts`                    | `util`                                                                                                           |
| `kits/`                       | one file for each kit                                                                                            |
| `adapter/compileTriggered.ts` | compiles a triggered spec into old props (targets, costs, `then`, messages)                                      |
| `adapter/*Action.ts`          | old-style game actions for the building blocks (`EffectsAction`, `AssignAction`, `MayAction`, `MayPayAction`, `ChooseNumberAction`, `ChosenAction`) |
| `adapter/ResolutionHistory.ts` | the uses of an ability for `ctx.timesResolved`, recorded by a wrapper around the ability limit                   |
| `adapter/FriendlyFateCost.ts` | "remove fate from friendly characters", with the fate-payment prompts of `ReduceableFateCost`                    |

### How the adapter works

- `ctx` is a view with getters over the live old contexts. For a "then" step, it reads the earlier targets from the parent contexts.
- The effects of a step become one `EffectsAction`. It runs the effects callback again for each context it gets (legality copies, resolution). It is attached to the last target, or to the ability when the step has no targets.
- Targets of a step form a chain with `dependsOn`, so an earlier target is legal only when the later ones can still be chosen.
- For the targets of `inPlayerOrder`, the earlier target also checks that the effects can affect its candidates, in its card condition (the effects are attached only to the last target).
- Each ability limit is wrapped in a `RecordingLimit`. The engine increments the limit after the costs are paid and resets it when the card changes zones; the wrapper records each use for `ctx.timesResolved`.
- For a select, each option gets the effects as its action. With `forChoice`, only the `forChoice` effect decides whether the option is legal.
- `from:` becomes `location: Any` with a check that the card is in the list. `Player` values become `Players.Self` or `Players.Opponent` for the context.

## Known limits

- The first step cannot announce only freeform text or nothing.
- `.otherwise()` branches cannot choose targets.
- `inPlayerOrder` supports two players.
- `ctx.timesResolved('game')` also restarts when a limit with a period resets (for example at the end of the round for `$limit.per('round', 1)`).
- The RRG "a chosen card must be affectable" check for targets before the last one is only done for `inPlayerOrder`.
- Seven Stings Keep chooses its number after the dash (`$effect.chooseNumber`), because its spec expects it; the card text puts it before the dash (`$target.number`).
- Hantei XXXVIII does not reach targets chosen after "then".
- `$effect.mayPay` and "to" do not use the RRG timing (decide before the effects, resolve at the same time).
- Duels: no `refusal`; with the "printed skill" duel rules, `duelistModifiers` do not change the counted value; no gained duel window abilities.
- The "can be mirrored" property is set only by `$effect.cancel()`. Cards that set `cannotBeMirrored` by hand lose the flag when they move to the builder (Raise the Alarm).
- `$effect.delayed` supports only "after" timing, not "would" with `instead`.

## Next steps

1. **Lint rule**: report `Constants` imports in files that use `this.ability`.
2. **Migrate `20-Core2`**, one clan for each PR. Add building blocks as the cards need them. No card uses `$target.number()` or `.ifYouDo()` yet.
3. **Internals (phase B)**, with the builder as the only spec:
    - store cost results by slot name; remove the `setDefaultTarget` mutation and the `any` in action callbacks;
    - compute "can be mirrored" from the ability, and delete `cannotBeMirrored`;
    - delayed replacements ("would" + `instead`) for Display of Power, The Empty City, Pilgrimage;
    - Hantei XXXVIII for targets after "then";
    - RRG timing for "may" and "to";
    - Ephemeral and Peaceful as gained keywords;
    - the known limits above.
4. **Later**: the other card sets, then make the old props API internal.
