
# Implementing Cards

For a complete reference of all available costs, game actions, effects, limits, and constants, see [ability_dsl.md](ability_dsl.md).

## Getting started

To implement a card, follow these steps:

### 1. Create a file named after the card.

Cards are organized under the `/server/game/cards` directory by grouping them by cycle/set number, pack number if applicable, and name.

```
/server/game/cards/01-Core/CloudTheMind.ts //Core Set
/server/game/cards/02.1-ToA/GoblinSneak.ts //Imperial Cycle, Pack 1, Tears of Amaterasu
```

### 2. Create a class for the card and export it.

Character, holding, event and attachment cards should be derived from the `DrawCard` class.

Province cards should be derived from the `ProvinceCard` class.

Stronghold cards should be derived from the `StrongholdCard` class.

The card class should have its `id` property set to the unique card identifier for that card. You can find these at https://api.fiveringsdb.com/cards

```typescript
import DrawCard from '../../DrawCard.js';

export default class CloudTheMind extends DrawCard {
    static id = 'cloud-the-mind';

    // Card definition
}
```

The enum constants used throughout the examples below (`CardType`, `Players`, `Location`, `Duration`, `TargetMode`, `Phase`, `AbilityType`, `ConflictType`) are imported from `'../../Constants.js'`. Card properties are typed against these enums — pass the constant (`cardType: CardType.Character`), not the raw string.

### 3. Override the `setupCardAbilities` method.

Persistent effects, actions, and triggered abilities should be defined in the `setupCardAbilities` method. Game actions and effects are named exports of `GameActions/GameActions.ts` and `effects.ts`; import the ones the card uses. Costs come from the `costs` namespace (`import * as costs from '../../costs/index.js'`), limits are named exports of `AbilityLimit.ts`. See below for more documentation.

```typescript
class CloudTheMind extends DrawCard {
    setupCardAbilities() {
        // Declare persistent effects, reactions and interrupts here.
    }
}
```

## Keywords

Most Keywords are automatically parsed from the card text. It isn't necessary to explicitly implement them unless they are provided by a conditional persistent effect.

## Static bonuses from attachments

Static attachment bonuses are automatically included in skill calculation.  They don't need to be implemented unless they are dynamic (e.g. Born in War)

## Persistent effects

Many cards provide continuous bonuses to other cards you control or detrimental effects to opponents cards in certain situations. These can be defined using the `persistentEffect` method. Cards that enter play while the persistent effect is in play will automatically have the effect applied, and cards that leave play will have the effect removed. If the card providing the effect becomes blank, the effect is automatically removed from all previously applied cards.

For a full list of properties that can be set when declaring an effect, look at `/server/game/Effects/ActiveEffect.ts`. To see all the types of effect which you can use (and whether they apply to cards, rings or players), look at `/server/game/effects.ts`. Here are some common scenarios:

### Matching conditions vs matching specific cards

The effect declaration (for card and ring effects) takes a `match` property. In most cases this will be a function that takes a `Card` (or `Ring`) object and should return `true` if the effect should be applied to that card.

```typescript
// Each honored Crane character you control gains Sincerity.
this.persistentEffect({
    match: card => card.getType() === CardType.Character && card.isHonored && card.isFaction('crane'),
    effect: addKeyword('sincerity')
});
```

In some cases, an effect should be applied to a specific card. While you could write a `match` function to match only that card, you can provide the `Card` (or `Ring`) object as a shorthand. Without `match`, a persistent effect applies to the card itself:

```typescript
// This character gets +3P while defending.
this.persistentEffect({
    condition: () => this.isDefending(),
    effect: modifyPoliticalSkill(3)
});
```

### Conditional effects

Some effects have a 'when', 'while' or 'if' clause within their text. These cards can be implemented by passing a `condition` function into the persistent effect declaration. The effect will only be applied when the function returns `true`. If the function returns `false` later on, the effect will be automatically unapplied from the cards it matched.

```typescript
// During a conflict in which this character is participating, each other participating Lion 
// character you control gets +1M.
this.persistentEffect({
    condition: () => this.isParticipating(),
    match: card => card.getType() === CardType.Character && card.isParticipating() && 
                   card.isFaction('lion') && card !== this,
    effect: modifyMilitarySkill(1)
});
```

### Targeting opponent or all matching cards

By default, an effect will only be applied to cards controlled by the current player. The `targetController` property can be modified to specify which players' cards should be targeted.

To target only opponent cards, set `targetController` to `Players.Opponent`:

```typescript
// While  attacking, each defending character gets -1M.
this.persistentEffect({
    condition: () => this.isAttacking(),
    match: card => card.isDefending(),
    targetController: Players.Opponent,
    effect: modifyMilitarySkill(-1)
});
```

To target all cards regardless of who controls them, set `targetController` to `Players.Any`:

```typescript
// While this character is participating in a conflict, characters cannot become dishonored.
this.persistentEffect({
    condition: () => this.isParticipating(),
    targetController: Players.Any,
    match: card => card.getType() === CardType.Character && card.location === Location.PlayArea,
    effect: cardCannot(RestrictionType.Dishonor)
});
```

### Dynamic skill

A few cards provide skill bonuses based on game state. For example, [Beastmaster Matriarch](https://fiveringsdb.com/card/beastmaster-matriarch) gets a bonus to military skill depending on how many rings have been claimed. Where the bonus should be continously updated, pass a function as the effect paramater. In `/server/game/effects.ts`, you can see whether an effect is coded as static (expects to be passed an integer), dynamic (expects to be passed a function) or flexible (can take either).

```typescript
// This character has +2[military] for each ring in each opponent's claimed ring pool.
this.persistentEffect({
    effect: modifyMilitarySkill(() => this.getTwiceOpponentsClaimedRings())
});
```

### Attachment-based effects

A `whileAttached` method is provided to define persistent effects that are applied to the card an attachment is attached. These effects remain as long as the card is attached to its parent and the attachment has not been blanked.

```typescript
// Attached character gains Pride.
this.whileAttached({
    effect: addKeyword('pride')
});
```

If the effect has an additional requirement, an optional `match` function can be passed in.
```typescript
// If attached character is unicorn, they gain +1M.
this.whileAttached({
    match: card => card.isFaction('unicorn'),
    effect: modifyMilitarySkill(1)
});
```

### Applying multiple effects at once
As a shorthand, it is possible to pass an array into the `effect` property to apply multiple effects that have the same conditions / matching functions.

```typescript
// This character gets +1M and +1P while you are less honorable than an opponent..
this.persistentEffect({
    condition: () => this.isLessHonorableThanOpponent(),
    effect: [
        modifyMilitarySkill(1),
        modifyPoliticalSkill(1)
    ]
});
```

### Applying effects to cards which aren't in play

By default, effects will only be applied to cards in the play area.  Certain cards effects refer to cards in your hand, such as reducing their cost or providing ambush to matching cards. In these cases, set the `targetLocation` property to `Location.Hand`.

```typescript
// Each Direwolf card in your hand gains ambush (X). X is that card's printed cost.
this.persistentEffect({
    // Explicitly target the effect to cards in hand.
    targetLocation: Location.Hand,
    match: card => card.hasTrait('Direwolf'),
    effect: gainAmbush()
});
```

This also applies to provinces, holdings and strongholds, which the game considers to be 'in play' even though they aren't in the play area.  Where an effect needs to be applied to these cards (or to characters who are in a province), set `targetLocation` to `Location.Provinces`.

```typescript
// This province gets +5 strength during [political] conflicts.
this.persistentEffect({
    targetLocation: Location.Provinces,
    condition: () => this.game.isDuringConflict(ConflictType.Political),
    effect: modifyProvinceStrength(5)
});
```

### Player modifying effects

Certain cards provide bonuses or restrictions on the player itself instead of on any specific cards. These effects are marked as `player` effects in `/server/game/effects.ts`. For player effects, `targetController` indicates which players the effect should be applied to (defaulting to the controlling player). Player effects should not have a `match` property.

```typescript
// While this character is participating in a conflict, opponents cannot play events.
this.persistentEffect({
    condition: () => this.isParticipating(),
    targetController: Players.Opponent,
    effect: playerCannot({ cannot: RestrictionType.Play, appliesTo: RestrictionScope.Events })
});
```

## Actions

Actions are abilities provided by the card text that players may trigger during action windows. They are declared with a builder: `this.action(title)` starts the ability, and each further call adds one part of it (a cost, a target, a game action...). The builder is registered when `setupCardAbilities` returns, so there is no `.build()` at the end. Here are some common scenarios:

### Declaring an action

The title is what will be displayed in the menu players see when clicking on the card.

```typescript
class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action('Ready this character')
            .gameAction(ready());
    }
}
```

The builder fixes its types from left to right: a call can use what earlier calls declared. Declare targets and costs first, then the `gameAction`, `handler`, `chatText` and `then` that read them.

A titled ability can only be started inside `setupCardAbilities`. To add one later (for example a test-only ability), wrap it in `declareAbilities`, which registers it when it returns:

```typescript
card.declareAbilities(() => {
    card.action('Steal an honor')
        .gameAction(takeHonor());
});
```

### Context object

When the game starts to resolve an ability, it creates a context object for that ability. Generally, the context ability has the following structure:

```typescript
class AbilityContext {
    constructor(properties) {
        this.game = properties.game;
        this.source = properties.source;
        this.player = properties.player;
        this.ability = properties.ability;
        this.costs = {};
        this.targets = {};
        this.rings = {};
        this.selects = {};
        this.stage = Stage.Effect;
    }
}
```

`context.source` is the card with the ability being used, and `context.player` is the player who is using the ability (almost always the controller of the `context.source`). When implementing actions and other triggered abilities, `context` should almost always be used (instead of `this`) to reference cards or players.  The only exception is that `this.game` can be used as an alternative to `context.game`.

The builder types `context` for you: `context.source` is the card's own class, `context.targets` holds the targets declared so far with their card types, and a triggered ability's `context.event` is the payload of the event it triggers on. No annotations or casts are needed.

### Checking ability restrictions

Card abilities can only be triggered if they have the potential to modify game state (outside of paying costs). To ensure that the action's play restrictions are met, pass a `condition` function that returns `true` when the restrictions are met, and `false` otherwise. If the condition returns `false`, the action will not be executed and costs will not be paid.

```typescript
// During a conflict, give this character +2/+2
this.action('Give this character +2/+2')
    .condition(() => this.game.isDuringConflict())
    // ...
```

```typescript
// While this character is participating in a conflict....
this.action('Switch a character\'s M and P skill')
    .condition((context) => context.source.isParticipating())
    // ...
```

"Conflict Action:" abilities are declared with `conflictAction`. It checks that a conflict is happening (of `conflictType`, if given) and, by the card's type, who must take part: a character must be participating, and so must the character an attachment in play is attached to. Events, holdings and attachments in hand only need the conflict. `evenFromHome` drops the participation check ("even when at home").

```typescript
// Action: While this character is defending in a [political] conflict... take 1 honor from your opponent.
this.conflictAction('Take 1 honor', { conflictType: ConflictType.Political })
    .condition((context) => context.source.isDefending())
    .gameAction(takeHonor());
```

```typescript
// Hand to Hand: "Action: During a [military] conflict, choose an attachment on a participating character - discard that attachment."
this.conflictAction('Discard an attachment', { conflictType: ConflictType.Military })
    .target({ cardType: CardType.Attachment, cardCondition: (card) => !!card.parentCharacter?.isParticipating() }, discardFromPlay());
```

### Paying additional costs for action

Some actions have an additional cost, such as bowing the card. In these cases, add it with `cost`. The action will check if the cost can be paid. If it can't, the action will not execute. If it can, costs will be paid automatically and then the action will execute.

For a full list of costs, look at the `/server/game/costs/` modules (or the costs in [ability_dsl.md](ability_dsl.md)).

```typescript
// During a conflict, bow this character. Choose another [crane] character - that character gets +0/+3 until the end of the conflict
this.action('Give a character +0/+3')
    // This card must be bowed as a cost for the action.
    .cost(costs.bowSelf())
    // ...
```

If a card has multiple costs, call `cost` once for each.

```typescript
this.action('Give all non-unique participating characters -2/-0')
    // This card must be bowed AND sacrificed as a cost for the action.
    .cost(costs.bowSelf())
    .cost(costs.sacrificeSelf())
    // ...
```

Some costs record what was paid in `context.costs`, under the key in the cost's result type (your editor shows it; it isn't always the cost's name, e.g. `bowSelf` and `bow` both record the bowed card under `bow`, the game action that pays them). A cost is only paid once the ability resolves, so the value may be missing when the ability is only checked for legality:

```typescript
// Action: Return any number of rings – place 1 fate on a character you control for each ring returned.
this.action('Return rings to put fate on character')
    .cost(costs.returnRings())
    .target({
        cardType: CardType.Character,
        controller: Players.Self
    }, placeFate((context) => ({
        amount: context.costs.returnedRings ? context.costs.returnedRings.length : 1
    })));
```

### Choosing / targeting cards

Cards that specify to 'choose' or otherwise target a specific card should be implemented with `target(properties, ...gameActions)`. The properties should include any limitations set by the ability, using `cardType`, `location`, `controller` and/or `cardCondition`. The game actions passed after the properties restrict the card chosen to those for which the action is legal (e.g. only cards in the play area can be dishonored, only cards with fate can have fate removed from them, etc.).  If several game actions are given, the target only needs to meet the requirements of one of them.

Generally, it's a good idea to pass at least a `cardType`, as that will automatically change the prompt to make it easier for the player to understand what is going on. It also types the card: with `cardType: CardType.Province`, `cardCondition` and `context.targets` see a `ProvinceCard`. Most other properties that apply to `Game.promptForSelect` are also valid here.

Without a `name` property the target is named `target`, which is also available as `context.target`. Abilities with several targets give each a `name` and read them from `context.targets[name]`.

```typescript
this.action('Grant Covert to a character')
    .target({
        cardType: CardType.Character,
        location: Location.PlayArea
    })
    // ...
```

```typescript
this.action('Sacrifice to discard an attachment')
    .target({
        cardType: CardType.Attachment
    }, discardFromPlay())
    // ...
```

An `optional: true` target may be skipped. Its value is then `[]`, or `undefined` if its prompt was hidden (`hideIfNoLegalTargets`), and the types say so.

To choose several cards at once, use `targetCards` with a `mode` (`TargetMode.Exactly`, `UpTo`, `ExactlyVariable`, `UpToVariable`, `MaxStat` or `Unlimited`). The target then holds an array:

```typescript
// Action: Dishonor a character you control with 1 or more glory – discard up to X attachments, where X is that character's glory.
this.action('Discard attachments')
    .cost(costs.dishonor({ cardType: CardType.Character, cardCondition: (card) => card.glory > 0 }))
    .targetCards({
        mode: TargetMode.UpToVariable,
        numCardsFunc: (context) => context.costs.dishonor ? context.costs.dishonor.glory : 1,
        cardType: CardType.Attachment
    }, discardFromPlay());
```

### Multiple targets

Some card abilities require multiple targets. Call `target` once for each; the name is the key the chosen card gets in `context.targets`.

```typescript
// Action: While this character is participating in a conflict, choose a ready non-participating character with printed
// cost 2 or lower controller by each player – move each chosen character to the conflict
this.action('Move characters into conflict')
    .condition((context) => context.source.isParticipating())
    .target({
        name: 'myChar',
        cardType: CardType.Character,
        controller: Players.Self,
        cardCondition: (card) => !card.bowed && (card.getCost() ?? 0) <= 2
    }, moveToConflict())
    .target({
        name: 'oppChar',
        cardType: CardType.Character,
        controller: Players.Opponent,
        cardCondition: (card) => !card.bowed && (card.getCost() ?? 0) <= 2
    }, moveToConflict());
```

A target that depends on an earlier one names it in `dependsOn`. Its `cardCondition` can then read the earlier target, typed:

```typescript
this.action('Move a card in a province')
    .target({
        name: 'cardInProvince',
        cardType: [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding],
        location: [Location.Provinces, Location.PlayArea]
    })
    .target({
        name: 'province',
        dependsOn: 'cardInProvince',
        cardType: CardType.Province,
        cardCondition: (card, context) => card.controller === context.targets.cardInProvince.controller
    }, moveCard((context) => ({
        target: context.targets.cardInProvince,
        destination: context.targets.province.location
    })))
    .chatText('move {1} to {2}', (context) => [context.targets.cardInProvince, context.targets.province]);
```

Other earlier targets may not be chosen yet when a target is checked, so they are optional in its callbacks.

### Targeting rings

Rings are targeted with `ringTarget`, which takes a `ringCondition` instead of a `cardCondition`. Most of the ring selection prompt properties are valid here also, see `/server/game/gamesteps/SelectRingPrompt.ts` for more details. The chosen ring is stored in `context.rings[name]`, and a ring target without a `name` also in `context.ring`.

```typescript
// Action: Bow a Spirit character you control – claim an unclaimed ring as if you won a political conflict.
this.action('Claim a ring')
    .cost(costs.bow({ cardType: CardType.Character, cardCondition: (card) => card.hasTrait('spirit') }))
    .ringTarget({
        activePromptTitle: 'Choose an unclaimed ring',
        ringCondition: (ring) => ring.isUnclaimed()
    }, claimRing({ takeFate: false, type: ConflictType.Political }))
    .chatText('claim {0} as a political ring');
```

Status tokens, printed abilities and element symbols are targeted with `tokenTarget`, `abilityTarget` and `elementTarget`.

### Select options

Some abilities require the player (or their opponent) to choose between multiple options. Use `select({ name, … }, choices)`, where `choices` maps each option shown to the player to the game action it resolves. An option is only offered when its game action is legal. The selected option is stored in `context.selects[name].choice`, and for a select named `target` also in `context.select`.

```typescript
// Action: If an opponent has declared 2 or more conflicts against you this phase, select one –
// take 1 fate or 1 honor from that opponent.
this.action('Take 1 fate or 1 honor')
    .phase(Phase.Conflict)
    .condition((context) => !!context.player.opponent &&
        this.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1)
    .select({
        player: Players.Self
    }, {
        'Take 1 fate': takeFate(),
        'Take 1 honor': takeHonor()
    });
```

When the options aren't game actions, give `select` conditions as choices and read the choice in a `handler`. When the options depend on the context (for example a label naming an earlier target), use `selectFrom`, which takes a function returning the choices.

```typescript
// Action: During a conflict at this province, select one – switch the contested ring with an unclaimed
// ring, or switch the conflict type.
this.action('Switch the conflict type or ring')
    .condition((context) => context.source.isConflictProvince())
    .select({
        player: Players.Self
    }, {
        'Switch the contested ring': () => Object.values(this.game.rings).some((ring) => ring.isUnclaimed()),
        'Switch the conflict type': () => true
    })
    .handler((context) => {
        // ... read context.select
    });
```

### Choosing while the ability resolves

The Rules Reference Guide ("Select") distinguishes when a selection is made: "If a selection is required before the effect of the ability resolves (i.e., before the dash), the selection is made during the same timing step in which targets are chosen. If a selection is indicated after the dash of an ability's text, that selection is made during the resolution of the effect." Before the dash, use `select` (above). After the dash, use the game action `chooseAction`: it prompts while the ability resolves, and only offers choices whose action is legal then. `choices` maps each label to a game action, or to `{ action, message }` when the chat should say what was chosen; `player: Players.Opponent` lets the opponent choose.

```typescript
// Reaction: After this character wins a conflict, choose a character – honor or dishonor that character.
this.reaction('Honor or dishonor a character')
    .when({
        afterConflict: (event, context) =>
            event.conflict.winner === context.source.controller && context.source.isParticipating()
    })
    .target({
        activePromptTitle: 'Choose a character to honor or dishonor',
        cardType: CardType.Character
    }, chooseAction({
        choices: {
            'Honor this character': {
                action: honor(),
                message: (_context, target, player) => msg`${player} chooses to honor ${target}`
            },
            'Dishonor this character': {
                action: dishonor(),
                message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
            }
        }
    }));
```


## Ability effects

In general, the effects of an ability should be implemented using Game Actions.

### Game Actions

Actions (and other triggered abilities) often use game actions.  Available game actions can be found in `/server/game/GameActions/GameActions.ts`, along with any parameters and their defaults.  Game actions passed to `gameAction` default to targeting the card generating the ability (for cards), the ability's player (for players; the opponent for actions that make a player give or discard something, such as `takeFate` or `discardAtRandom`) and the contested ring (for rings), and an `amount` defaults to 1. Game actions passed to a `target` call default to that target, and the actions inside a composite action (`multiple`, `sequential`, `conditional`, ...) to the composite's target. You can change the target of a game action or the parameters by passing either an object with the properties you want, or a function which takes `context` and returns those properties.

```typescript
// Action: During a conflict, bow this attachment – move attached character to the conflict.
this.action('Move this character into the conflict')
    .cost(costs.bowSelf())
    .gameAction(moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] })));
```

```typescript
// Reaction: After this character enters play – place 1 fate from an opponent's fate pool on it.
this.reaction('Steal a fate')
    .when({
        onCharacterEntersPlay: (event, context) => event.card === context.source
    })
    .gameAction(placeFate((context) => ({ origin: context.player.opponent })));
```

Effects that can't be expressed as game actions go in a `handler`, which takes the context. Prefer game actions where possible: the engine can only check a game action for legality. A handler replaces the step's resolution, so setup throws when it is combined with game actions, `if()`, `onAffinity()` or a following step. Game actions on the target still decide which cards can be chosen, and the handler can resolve them itself (Maze of Illusion). For code that runs as one action among others, use `gameAction(handler({ handler }))`.

### Prompts inside a handler

A handler that asks the player something uses `promptWithHandlerMenu` (buttons) and `promptForSelect` (cards). Keep it to one flow:

- Work out which options are possible first, and skip the menu when only one is.
- Check legality with the game actions themselves (`honor().canAffect(card, context)`), the same way the targets were checked.
- Resolve everything that happens together in one `applyGameAction` call, so it opens one event window.

```typescript
// Action: During a conflict at this province, choose 2 participating characters – honor one of those characters and dishonor the other.
private chooseStatus(context: AbilityContext, pair: readonly BaseCard[]) {
    const statuses = STATUSES.filter((status) => pair.some((card) => canApply(status, card, context)));
    if(statuses.length === 1) {
        this.chooseCharacter(statuses[0], context, pair, false);
        return;
    }
    context.game.promptWithHandlerMenu(context.player, {
        activePromptTitle: 'Choose a character to:',
        context,
        options: statuses.map((status) => ({ text: status, handler: () => this.chooseCharacter(status, context, pair, true) }))
    });
}
```

`options` pairs each button with its handler. Use `choices` with a single `choiceHandler` only when the labels are computed at run time. `promptForSelect` types its callbacks from `cardType`: with `cardType: CardType.Character`, `cardCondition` and `onSelect` get a `DrawCard`. A prompt for several cards needs a `mode`, and its `onSelect` gets an array. See `ShamefulDisplay.ts` for the whole card.

### Effect messages

Once costs have been paid and targets chosen (but before the ability resolves), the game automatically displays a message in the chat box which tells both players the ability, costs and targets of the effect.  Game actions will automatically generate their own effect message, although this will only work for a single game action.  If the effects of the ability involve two or more game actions, or the effect is a lasting effect or uses a handler, then a `chatText` is required.  The effect message will be passed the target (card(s) or ring) of the effect (or the source if there are no targets) as its first parameter (and so can be referenced using `'{0}'` in the message).  If other references are required, use curly bracket references in the message (`'{1}'`, `'{2}'`, etc.) and pass a function taking the `context` object as the second argument:

```typescript
// Action: Return this attachment to your hand and dishonor attached character.
this.action('Return court mask to hand')
    .chatText('return {0} to hand, dishonoring {1}', (context) => [context.source.parentCharacter])
    .gameAction(
        returnToHand(),
        dishonor((context) => ({ target: context.source.parentCharacter ?? [] }))
    );
```

Instead of numbered references, the message can be a template built with `msg` from `GameChat.ts`. Its values are the arguments, in order, and `{0}` is not the target: name everything the message shows.

```typescript
// Levy: "...that player must select one - give you 1 fate or 1 honor. If you have fewer cards in your hand than that player, draw 1 card."
.chatText((context) => {
    const resource = context.select === 'Give your opponent 1 fate' ? 'fate' : 'honor';
    return msg`take 1 ${resource} from ${context.player.opponent}${hasFewerCards(context) ? ' and draw a card' : ''}`;
})
```

```typescript
// Action: While this character is participating in a conflict, choose another participating character – until the end of the conflict, that character gets +2/+2 for each holding you control.
this.action('Give a character a bonus for each holding')
    .condition((context) => context.source.isParticipating())
    .target({
        cardType: CardType.Character,
        cardCondition: (card, context) => card.isParticipating() && card !== context.source
    }, cardLastingEffect((context) => ({
        effect: modifyBothSkills(2 * context.player.getNumberOfHoldingsInPlay())
    })))
    .chatText('give {0} +{1}{2}/+{1}{3}', (context) => [2 * context.player.getNumberOfHoldingsInPlay(), 'military', 'political']);
```

### Then

Card text such as "...then do X" or "if you do, X" is implemented with `then()`: it starts the next step, declared with the same methods (`target`, `select`, `gameAction`, `handler`, `then`). The step resolves once the events of the step before resolved in full. Its context holds the targets, selects and costs chosen so far, so `context.target` or `context.targets.name` still name the earlier choices. `thenIf((context) => …)` ("Then, if …") starts a step that resolves when the step before resolved in full and the condition holds. A step prints its message with ``message((context) => msg`…`)``. Ability settings (`location`, `limit`, `condition`, …) go before the first `then()`. A step's context also has `previousEvents`, the events of the step before (for "discard it, then … its cost"), and the step before's `deckSearchSelected`. Card text without "then" that is still read after the first part ("If it is now in a province …", "Ready the character now at home") uses `afterwardsIf((context) => …)` or `afterwards()`: the step follows when its condition holds (or always), whether or not the step before resolved in full. In a step's `select`, a choice can be a condition such as `No: () => true`: it does nothing and raises no event, so a following step doesn't resolve after it.

```typescript
// Reaction: After you claim a ring that matches the element of your role – put this character into play from your dynasty discard pile or provinces. Then, put 1 fate on this character.
this.reaction('Put this into play')
    .when({ onClaimRing: (event, context) => event.player === context.player && claimsRoleElement(context.player, event) })
    .location([Location.Provinces, Location.DynastyDiscardPile])
    .gameAction(putIntoPlay())
    .then()
    .gameAction(placeFate());
```

```typescript
// Conflict Action: Choose an item attachment on an enemy participating character – discard it. Then, if it was a weapon, this character gets +2 military.
.target({ cardType: CardType.Attachment, cardCondition: … }, discardFromPlay())
.thenIf((context) => context.target.hasTrait('weapon'))
.gameAction(cardLastingEffect({ effect: modifyMilitarySkill(2) }))
.message((context) => msg`${context.source} gains +2${'military'} due to discarding a weapon`);
```

### If and otherwise

Card text such as "if X, do A. Otherwise, do B" is implemented with `if((context) => …)` and `otherwise()`: the game actions after `if()` resolve when the condition holds, the ones after `otherwise()` when it doesn't. Without `otherwise()` nothing happens when the condition fails. Targets go before `if()`, and the branch lines are indented one level deeper:

```typescript
// Reaction: After the resolution of a conflict in which this character was defending - if you won the conflict, gain 2 honor. Otherwise, ready this character.
this.reaction('Ready a character or gain honor')
    .when({ onConflictFinished: () => this.defendingAtConflictResolution })
    .if((context) => context.event.conflict.winner === context.source.controller)
        .gainHonor(2)
    .otherwise()
        .ready();
```

Right after a card target, the branches belong to that target: their actions resolve on the chosen card (after the target's own game actions, if it has any: `.target(props, bow()).if(…).dishonor()`), and only cards the chosen branch can affect are selectable. After several targets without game actions, or once the ability has game actions of its own, the branches stay on the ability and their actions name their targets. The condition reads the card as `context.target`:

```typescript
// Shosuro Hiroyuki: … Choose a participating character with lower political skill than this character - if that character is dishonored, its controller discards a random card from their hand. Otherwise, dishonor that character.
.target({ cardType: CardType.Character, cardCondition: (card, context) => card.isParticipating() && card.politicalSkill < context.source.politicalSkill })
.if((context) => context.target.isDishonored)
    .gameAction(discardAtRandom((context) => ({ target: context.target.controller })))
.otherwise()
    .gameAction(dishonor());
```

Elsewhere, a game action in a branch targets what it would target on its own: the source card for card actions, the player for player actions. The same holds inside `multiple`, `conditional`, `onAffinity` and the other composite actions when they have no target of their own; under a target, they pass the chosen target on.

### Duels

An ability that initiates a duel passes a function returning the duel's properties to `initiateDuel`. Its `gameAction` receives the resolved duel:

```typescript
this.action('Initiate a military duel to dishonor')
    .initiateDuel(() => ({
        type: DuelType.Military,
        gameAction: (duel) => dishonor({ target: duel.loser }),
        chatText: (context, duel) => msg`${duel.loser} is dishonored`
    }));
```

Abilities that trigger during a duel are declared with `duelChallenge`, `duelFocus` and `duelStrike`. They take the title and an optional condition on the duel; `context.event.duel` is the duel:

```typescript
this.duelFocus('Help a character with a duel', (duel, context) => duel.participants.includes(context.source))
    .gameAction(duelLastingEffect((context) => ({
        target: context.event.duel,
        effect: modifyDuelSkill({ amount: 1, player: context.player }),
        duration: Duration.UntilEndOfDuel
    })))
    .chatText('add 1 to their duel total');
```

### Lasting effects

Unlike persistent effects, lasting effects are typically applied during an action, reaction or interrupt and expire after a specified period of time.  Lasting effect use the same properties as persistent effects, above.  Lasting effects are applied using the `cardLastingEffect`, `ringLastingEffect` or `playerLastingEffect`, depending on what they affect.  They take a `duration:` property which is one of `Duration.UntilEndOfConflict` (the default, so it can be left out), `Duration.UntilEndOfPhase` or `Duration.UntilEndOfRound`.

```typescript
// Action: During a conflict, bow this character. Choose another [crane] character – that character
// gets +3 [political] until the end of the conflict.
this.action('Give a character +0/+3')
    .condition(() => this.game.isDuringConflict())
    .cost(costs.bowSelf())
    .target({
        cardType: CardType.Character,
        cardCondition: (card, context) => card !== context.source && card.isFaction('crane')
    }, cardLastingEffect({
        effect: modifyPoliticalSkill(3)
    }))
    .chatText('give {0} +3{1} skill', () => ['political']);
```

To apply an effect to last until the end of the current phase, use `Duration.UntilEndOfPhase`:
```typescript
// Action: Reduce the cost of the next event you play this phase by 1.
this.action('Reduce cost of next event by 1')
    .chatText('reduce the cost of their next event by 1')
    .gameAction(playerLastingEffect({
        duration: Duration.UntilEndOfPhase,
        effect: reduceNextPlayedCardCost(1, (card) => card.type === CardType.Event)
    }));
```

To apply an effect to last until the end of the round, use `Duration.UntilEndOfRound`:
```typescript
// Action: Choose a holding you control – you may trigger each of that holding's triggered abilities an additional time this round.
this.action('Add an additional ability use to a holding')
    .target({
        cardType: CardType.Holding,
        location: Location.Provinces,
        controller: Players.Self
    }, cardLastingEffect({
        duration: Duration.UntilEndOfRound,
        targetLocation: Location.Provinces,
        effect: increaseLimitOnAbilities()
    }))
    .chatText('add an additional use to each of {0}\'s abilities');
```

### Limiting an action to a specific phase

Some actions are limited to a specific phase by their card text. Use `phase` to limit the action to just that phase. Valid phases include `Phase.Dynasty`, `Phase.Draw`, `Phase.Conflict`, `Phase.Fate`. The default is `'any'` which allows the action to be triggered in any phase.

```typescript
this.action('Sacrifice to discard an attachment')
    .cost(costs.sacrificeSelf())
    .phase(Phase.Conflict)
    .target({
        cardType: CardType.Attachment
    }, discardFromPlay());
```

### Limiting the number of uses

Some actions have text limiting the number of times they may be used in a given period. Use `limit` with one of the duration-specific ability limiters. See `/server/game/AbilityLimit.ts` for more details.

```typescript
this.action('Remove 1 fate')
    .limit(perConflict(2))
    // ...
```

### Actions outside of play

Certain actions, such as that of Ancestral Guidance, can only be activated while the character is in the discard pile. Such actions should be declared with `location`, naming the location from which the ability may be activated. The player can then activate the ability by simply clicking the card. If there is a conflict (e.g. both the ability and playing the card normally can occur), then the player will be prompted.

```typescript
this.action('Play from discard pile')
    .location(Location.ConflictDiscardPile)
    // ...
```

## Triggered abilities

Triggered abilities include all card abilities that have **Interrupt**, **Forced Interrupt**, **Reaction**, **Forced Reaction**. Implementing a triggered ability is similar to actions above, but instead of `this.action`, use `this.reaction`, `this.interrupt`, `this.forcedReaction`, `this.forcedInterrupt` or `this.wouldInterrupt`. Costs and targets are declared in the same way. For full documentation of properties, see `/server/game/TriggeredAbility.ts`. Here are some common scenarios:

### Defining the triggering condition

Each triggered ability has an associated triggering condition, declared with `when` right after the title. It takes an object whose key is the name of the event, and whose value is a function which takes the event and the context object. When the function returns `true`, the ability can be triggered. The event's payload is typed by its name, and so is `context.event` in the rest of the ability.

```typescript
// When this card enters play, honor it
this.reaction('Honor this character')
    .when({
        onCharacterEntersPlay: (event, context) => event.card === context.source
    })
    .gameAction(honor());
```

In rare cases, there may be multiple triggering conditions for the same ability. For example, [Ikoma Prodigy](https://fiveringsdb.com/card/ikoma-prodigy) gains an honor when fate is placed on her while playing her, or while she is in play. In these cases, just define an additional event on the `when` object.

```typescript
this.reaction('Gain 1 honor')
    .when({
        onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.fate > 0,
        onMoveFate: (event, context) => event.recipient === context.source && (event.fate ?? 0) > 0
    })
    .gainHonor();
```

To trigger once on all the events of a window together (for example on the total fate they moved), use `aggregateWhen` instead of `when`.

### Forced reactions and interrupts

Forced reactions and interrupts do not provide the player with a choice - unless cancelled, the effect will always resolve.

To declare a forced reaction, use the `forcedReaction` method:

```typescript
this.forcedReaction('Can\'t be discarded or remove fate')
    .when({
        onPhaseStarted: (event, context) => event.phase === Phase.Fate && !!context.player.opponent &&
                                            context.player.honor >= context.player.opponent.honor + 5
    })
    .chatText('stop him being discarded or losing fate in this phase')
    .gameAction(cardLastingEffect({
        duration: Duration.UntilEndOfPhase,
        effect: [
            cardCannot(RestrictionType.RemoveFate),
            cardCannot(RestrictionType.DiscardFromPlay)
        ]
    }));
```

To declare a forced interrupt, use the `forcedInterrupt` method.

```typescript
this.forcedInterrupt('Draw a card')
    .when({
        onCardLeavesPlay: (event, context) => event.card === context.source && context.source.hasSincerity()
    })
    .chatText('{1} draws a card due to {0}\'s Sincerity', (context) => [context.player])
    .draw();
```

### 'Would' interrupts

Some abilities allow the player to cancel an effect. These effects are always interrupts, and are usually templated as 'Interrupt: When [trigger] would....'.  These are implemented
using the `wouldInterrupt` method, and the builder's `.cancel()` cancels the event (optionally replacing it with a `replacementGameAction`).

```typescript
this.wouldInterrupt('Cancel an event')
    .when({
        onInitiateAbilityEffects: (event) => event.card.type === CardType.Event
    })
    .cost(costs.dishonor({ cardType: CardType.Character, cardCondition: (card) => card.hasTrait('courtier') }))
    .chatText('cancel {1}', (context) => [context.event.card])
    .cancel();
```

### Abilities outside of play

Certain abilities, such as that of Vengeful Oathkeeper can only be activated in non-play locations. Such reactions should be declared with `location`, naming the location from which the ability may be activated. The player can then activate the ability when prompted.

```typescript
this.reaction('Put this into play')
    .when({
        afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === ConflictType.Military
    })
    .location(Location.Hand)
    .gameAction(putIntoPlay());
```

### Gained abilities

Abilities given to other cards by an effect are written with the same builder, in a callback; `context.source` is the card that gains the ability:

```typescript
this.whileAttached({
    effect: gainAbility.reaction('Gain 1 fate', {
        afterConflict: (event, context) => event.conflict.winner === context.source.controller
    }, (ability) => ability.gainFate())
});
```

`gainAbility.action(title, …)` grants an action; `.reaction`, `.interrupt`, `.wouldInterrupt`, `.forcedReaction` and `.forcedInterrupt` take the `when` first. A persistent effect is still `gainAbility(AbilityType.Persistent, { … })`, and `gainAbility(ability.abilityType, ability)` copies an existing ability.

## Ability limits

Actions, reactions, and interrupts can have limits on how many times they may be used within a certain period. These limits are set with `limit`. `AbilityLimit.ts` exports a helper for each period.

To limit an ability per conflict, use `perConflict(x)`.

To limit an ability per phase, use `perPhase(x)`.

To limit an ability per round, use `perRound(x)`.

In each case, `x` should be the number of times the ability is allowed to be used. Several abilities that share a limit (such as "max 1 per round between these abilities") pass the same limit object, created once in `setupCardAbilities`.

## Language

### Game messages should begin with the player doing the action

Game messages should begin with the name of the player to ensure a uniform format and make it easy to see who triggered an ability.

* **Bad**: Kaiu Shuichi triggers to gain 1 fate for Player1
* **Good**: Player1 uses Kaiu Shuichi to gain 1 fate

### Game messages should not end in punctuation

No game messages should end in a period, exclaimation point or question mark.

* **Bad**: Player1 draws 2 cards.
* **Good**: Player1 draws 2 cards

### Game messages should use present tense.

All game messages should use present tense.

* **Bad**: Player1 has used Isawa Masahiro to discard Miya Mystic
* **Bad**: Player1 chose to discard Miya Mystic
* **Good**: Player1 uses Isawa Masahiro to discard Miya Mystic
* **Good**: Player1 chooses to discard Miya Mystic

### Targeting prompts should use the format "Choose a \<card type\>" where possible.

Targeting prompts should ask the player to choose a card or a card of particular type to keep prompt titles relatively short, without specifying the final goal of card selection.

* **Bad**: Choose a character to return to hand
* **Good**: Choose a character

**Exception:** If a card requires the player to choose multiple cards (e.g. Rebuild), or if a card requires the player's opponent to choose a card (e.g. Endless Plains) you can add context about which one they should be selecting. Just keep it as short as reasonably possible.

As valid selections are already presented to the user via visual clues, targeting prompts should not repeat selection rules in excessive details. Specifying nothing more and nothing less than the eligible card type (if any) is the good middle ground (this is what most prompts will default to).

* **Bad**: Choose a Bushi
* **Good**: Choose a character

* **Bad**: Choose a defending Crab character
* **Good**: Choose a character

* **Bad**: Choose a card from your discard pile
* **Good**: Choose a card

* **Good**: Choose an attachment or location
