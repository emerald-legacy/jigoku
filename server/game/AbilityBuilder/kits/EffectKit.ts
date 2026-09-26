import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';
import { Duration, DuelType, Location, PlayType } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import type { EffectFactory } from '../../Effects/EffectBuilder.js';
import { GameAction } from '../../GameActions/GameAction.js';
import * as GameActions from '../../GameActions/GameActions.js';
import type Player from '../../Player.js';
import type { DuelChoice, DuelKind, DuelOutcome, Until } from '../types.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCardValue from '../../BaseCard.js';
import type { EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import type Ring from '../../Ring.js';
import { AssignAction, type AssignOptions } from '../adapter/AssignAction.js';
import { ChosenAction } from '../adapter/ChosenAction.js';
import { ChooseNumberAction, type ChooseNumberOptions } from '../adapter/ChooseNumberAction.js';
import { EffectsAction, markChoiceBranch } from '../adapter/EffectsAction.js';
import {
    formatted,
    messageKit,
    messageList,
    type FreeformMessage,
    type MessageKit,
    type MessageResult,
    type MessageSpec
} from './MessageKit.js';
import { MayAction, type MayOptions } from '../adapter/MayAction.js';
import { MayPayAction, type Payment } from '../adapter/MayPayAction.js';
import type CardAbility from '../../CardAbility.js';
import { createModifierKit, modFactories, type Mod, type ModifierKit, type ModTarget } from './ModifierKit.js';

export type Many<T> = undefined | T | readonly T[];

/** One effect. Only `$effect` creates it. */
export class EffectNode {
    readonly #action: undefined | GameAction;
    readonly #context: AbilityContext;
    readonly #description: undefined | string;

    constructor(action: undefined | GameAction, context: AbilityContext, description?: string) {
        this.#action = action;
        this.#context = context;
        this.#description = description;
    }

    /** True when this effect can change the game state now. */
    canAffect(): boolean {
        return this.#action?.hasLegalTarget(this.#context) ?? false;
    }

    static actionOf(node: EffectNode): undefined | GameAction {
        return node.#action;
    }

    /** A short text for the choice of `$effect.mayPay`, for example "resolve this ability again". */
    static descriptionOf(node: EffectNode): undefined | string {
        return node.#action ? node.#description : undefined;
    }
}

export function nodeActions(nodes: readonly EffectNode[]): GameAction[] {
    return nodes.map((node) => EffectNode.actionOf(node)).filter((action) => action !== undefined);
}

type Mods<T extends ModTarget> = ($modifier: ModifierKit) => readonly Mod<T>[];

const lastingModifiers = createModifierKit({
    get entry(): never {
        throw new Error('Ability builder: a lasting effect cannot give a gained ability yet');
    },
    compile(): never {
        throw new Error('Ability builder: a lasting effect cannot give a gained ability yet');
    }
});

/** What a player can pay with `$effect.mayPay`. */
function createPayKit(player: Player) {
    return {
        loseHonor: (amount = 1): Payment => ({
            action: GameActions.loseHonor({ target: player, amount }),
            label: `Lose ${amount} honor`
        }),
        removeFate: (card: BaseCard, amount = 1): Payment => ({
            action: GameActions.removeFate({ target: card, amount }),
            label: `Remove ${amount} fate`
        })
    };
}

export type PayKit = ReturnType<typeof createPayKit>;

type DelayedWhen = { [N in EventName]?: (event: GameEvent<N>) => unknown };

interface DelayedBranch {
    announce?: ($message: MessageKit) => MessageResult;
    effects?: ($effect: EffectKit) => readonly EffectNode[];
}

interface DelayedOptions {
    when: DelayedWhen;
    /** Checked when the effect triggers. Without it, the effect always takes `then`. */
    if?: () => boolean;
    then: DelayedBranch;
    otherwise?: DelayedBranch;
    /** How long the effect waits for its trigger. The default is the end of the round. */
    until?: Until;
}

/** The skill rules of the game mode: which value a duel counts. */
type DuelRules = 'currentSkill' | 'printedSkill' | 'skirmish';

interface DuelOptions {
    /** "using each character's base military skill": the value that the duel counts for each character. */
    statistic?: (card: DrawCard, rules: DuelRules) => number;
    /** "giving each dueling character ... until the end of the duel". */
    duelistModifiers?: (card: DrawCard, $modifier: ModifierKit) => readonly Mod<'card'>[];
    /** Prints as "Duel Effect: <text>" when the consequences resolve. */
    announce?: ($message: MessageKit, outcome: DuelOutcome) => FreeformMessage;
}

type Consequences = (outcome: DuelOutcome) => readonly EffectNode[];

const DUEL_TYPE: Record<DuelKind, DuelType> = {
    military: DuelType.Military,
    political: DuelType.Political,
    glory: DuelType.Glory
};

function outcomeOf(duel: Duel): DuelOutcome {
    return {
        duel,
        winner: duel.winner ?? [],
        loser: duel.loser ?? [],
        winningPlayer: duel.winningPlayer,
        losingPlayer: duel.losingPlayer
    };
}

/** The old duel action: resolves the duel, then the consequences for its result (RRG D.4). */
function duelAction(
    type: DuelKind,
    challenger: undefined | DrawCard,
    challenged: undefined | DrawCard,
    consequences: Consequences,
    options: DuelOptions
): undefined | GameAction {
    if(!challenger || !challenged) {
        return undefined;
    }

    const { statistic, duelistModifiers, announce } = options;
    const modifiers = (card: DrawCard) => (duelistModifiers ? modFactories(duelistModifiers(card, lastingModifiers)) : []);
    return GameActions.duel({
        type: DUEL_TYPE[type],
        challenger,
        target: challenged,
        gameAction: (duel: Duel) => new EffectsAction(() => nodeActions(consequences(outcomeOf(duel)))),
        ...(statistic ? { statistic } : {}),
        ...(duelistModifiers ? { challengerEffect: modifiers(challenger), targetEffect: modifiers(challenged) } : {}),
        ...(announce
            ? {
                message: '{0}',
                messageArgs: (duel: Duel, context: AbilityContext) => [
                    formatted(context.game, announce(messageKit, outcomeOf(duel)))
                ]
            }
            : {})
    });
}

interface ChooseRingOptions {
    prompt?: string;
    filter?: (ring: Ring) => boolean;
    announce?: ($message: MessageKit, ring: Ring) => MessageSpec;
}

interface LastingOptions {
    until?: Until;
}

function duration(until: Until = 'conflict'): { duration: Duration; until?: object } {
    switch(until) {
        case 'conflict':
            return { duration: Duration.UntilEndOfConflict };
        case 'phase':
            return { duration: Duration.UntilEndOfPhase };
        case 'round':
            return { duration: Duration.UntilEndOfRound };
        case 'duel':
            return { duration: Duration.UntilEndOfDuel };
        case 'game':
            return { duration: Duration.Custom, until: { onCardLeavesPlay: () => false } };
    }
}

/** An action that never has a legal target. */
function never(): GameAction {
    return new GameAction({ target: [] });
}

function target<T>(value: Many<T>): T[] {
    if(value === undefined) {
        return [];
    }
    return isList(value) ? [...value] : [value];
}

function isList<T>(value: T | readonly T[]): value is readonly T[] {
    return Array.isArray(value);
}

/** The current locations of the cards, for the actions that check where their target is. */
function locationsOf(cards: Many<BaseCard>): Location[] {
    return [...new Set(target(cards).map((card) => card.location))];
}

/** The old action of a delayed effect: picks the branch and prints its announcement when it triggers. */
function delayedAction(anchor: undefined | BaseCard | Player, options: DelayedOptions, multipleTrigger: boolean): undefined | GameAction {
    if(!anchor) {
        return undefined;
    }

    const branch = () => (!options.if || options.if() ? options.then : options.otherwise);
    const gameAction = new EffectsAction((context) => {
        const taken = branch();
        const actions = taken?.effects ? nodeActions(taken.effects(createEffectKit(context))) : [];
        const announce = taken?.announce;
        if(!announce) {
            return actions;
        }
        const print = GameActions.handler({
            handler: () => {
                for(const message of messageList(announce(messageKit))) {
                    context.game.addMessage('{0}', formatted(context.game, message));
                }
            }
        });
        return [print, ...actions];
    });
    const when = Object.fromEntries(
        Object.entries(options.when).map(([name, fn]) => [name, (event: never) => Boolean((fn as (event: never) => unknown)(event))])
    );
    const properties = { when, multipleTrigger, gameAction };

    return anchor instanceof BaseCardValue
        ? GameActions.cardLastingEffect({
            target: anchor,
            effect: AbilityDsl.effects.delayedEffect(properties),
            ...duration(options.until ?? 'round')
        })
        : GameActions.playerLastingEffect({
            targetController: anchor,
            effect: AbilityDsl.effects.playerDelayedEffect(properties),
            ...duration(options.until ?? 'round')
        });
}

export function createEffectKit(context: AbilityContext) {
    const node = (action: undefined | GameAction) => new EffectNode(action, context);
    const mods = <T extends ModTarget>(build: Mods<T>): EffectFactory[] => modFactories(build(lastingModifiers));

    return {
        bow: (cards: Many<BaseCard>) => node(GameActions.bow({ target: target(cards) })),
        ready: (cards: Many<BaseCard>) => node(GameActions.ready({ target: target(cards) })),
        honor: (cards: Many<BaseCard>) => node(GameActions.honor({ target: target(cards) })),
        dishonor: (cards: Many<BaseCard>) => node(GameActions.dishonor({ target: target(cards) })),
        sendHome: (cards: Many<BaseCard>) => node(GameActions.sendHome({ target: target(cards) })),
        moveToConflict: (cards: Many<BaseCard>) => node(GameActions.moveToConflict({ target: target(cards) })),
        putIntoConflict: (cards: Many<BaseCard>) => node(GameActions.putIntoConflict({ target: target(cards) })),
        putIntoPlay: (cards: Many<BaseCard>) => node(GameActions.putIntoPlay({ target: target(cards) })),
        discardFromPlay: (cards: Many<BaseCard>) => node(GameActions.discardFromPlay({ target: target(cards) })),
        discard: (cards: Many<BaseCard>) => node(GameActions.discardCard({ target: target(cards) })),
        flipDynasty: (cards: Many<BaseCard>) => node(GameActions.flipDynasty({ target: target(cards) })),
        /**
         * "Play that card as if it were in your hand". With `givingEphemeral`, the card is removed from
         * the game after it is played (Ephemeral gained from this effect).
         */
        playAsIfFromHand: (card: undefined | DrawCard, options: { givingEphemeral?: boolean } = {}) =>
            node(card
                ? GameActions.playCard({
                    target: card,
                    playType: PlayType.PlayFromHand,
                    source: context.source,
                    resetOnCancel: true,
                    ...(options.givingEphemeral
                        ? {
                            postHandler: (played: AbilityContext) => {
                                context.game.addMessage('{0} is removed from the game by {1}\'s ability', played.source, context.source);
                                context.player.moveCard(played.source, Location.RemovedFromGame);
                            }
                        }
                        : {})
                })
                : undefined),

        /** Shuffle the cards into their deck, from where they are now. */
        shuffleIntoDeck: (cards: Many<BaseCard>) =>
            node(GameActions.returnToDeck({ target: target(cards), shuffle: true, location: locationsOf(cards) })),
        /** Remove the cards from the game, from where they are now. */
        removeFromGame: (cards: Many<BaseCard>) =>
            node(GameActions.removeFromGame({ target: target(cards), location: locationsOf(cards) })),
        putOnBottomOfDeck: (cards: Many<BaseCard>) =>
            node(GameActions.returnToDeck({ target: target(cards), bottom: true })),
        removeFate: (cards: Many<BaseCard>, amount = 1) =>
            node(GameActions.removeFate({ target: target(cards), amount })),
        placeFate: (cards: Many<BaseCard>, amount = 1) =>
            node(GameActions.placeFate({ target: target(cards), amount })),

        attach: (attachment: undefined | DrawCard, card: undefined | BaseCard) =>
            node(attachment ? GameActions.attach({ target: target(card), attachment }) : undefined),
        takeControlAndAttach: (attachment: undefined | DrawCard, card: undefined | BaseCard) =>
            node(attachment ? GameActions.attach({ target: target(card), attachment, takeControl: true }) : undefined),

        draw: (players: Many<Player>, amount = 1) => node(GameActions.draw({ target: target(players), amount })),
        gainHonor: (players: Many<Player>, amount = 1) =>
            node(GameActions.gainHonor({ target: target(players), amount })),
        loseHonor: (players: Many<Player>, amount = 1) =>
            node(GameActions.loseHonor({ target: target(players), amount })),
        /** RRG "Take": the player of the ability gains, `from` loses. */
        takeHonor: (options: { from: undefined | Player; amount?: number }) =>
            node(GameActions.takeHonor({ target: target(options.from), amount: options.amount ?? 1 })),
        /** RRG "Take": the player of the ability gains, `from` loses. */
        takeFate: (options: { from: undefined | Player; amount?: number }) =>
            node(GameActions.takeFate({ target: target(options.from), amount: options.amount ?? 1 })),

        claimRingAsPolitical: (ring: undefined | Ring, options: { gainFate?: boolean } = {}) =>
            node(ring ? GameActions.claimRing({ target: ring, type: 'political', takeFate: options.gainFate ?? false }) : undefined),

        /**
         * "Choose a number" while the effect resolves. The `announce` message prints when the number
         * is chosen. Prefer `$target.number` when the card chooses the number before the dash.
         */
        chooseNumber: (
            options: ChooseNumberOptions & { chooser?: Player; announce?: ($message: MessageKit, amount: number) => MessageSpec },
            effect: (amount: number) => EffectNode
        ) => {
            const announce = options.announce;
            return node(
                new ChooseNumberAction(options.chooser ?? context.player, options, (amount) => {
                    const action = EffectNode.actionOf(effect(amount));
                    if(!action || !announce) {
                        return action;
                    }
                    return GameActions.multiple([
                        GameActions.handler({
                            handler: () => context.game.addMessage('{0}', formatted(context.game, announce(messageKit, amount)))
                        }),
                        action
                    ]);
                })
            );
        },

        /** "Choose a ring - ...": a choice while the effect resolves. */
        chooseRing: (options: ChooseRingOptions, effect: (ring: Ring) => EffectNode) => {
            const announce = options.announce;
            return node(GameActions.selectRing({
                activePromptTitle: options.prompt,
                ringCondition: (ring: Ring) => !options.filter || options.filter(ring),
                gameAction: new ChosenAction<Ring>((ring) => EffectNode.actionOf(effect(ring))),
                ...(announce
                    ? {
                        message: '{0}',
                        messageArgs: (ring: Ring) => [formatted(context.game, announce(messageKit, ring))]
                    }
                    : {})
            }));
        },

        /** "The next time X, do Y": a delayed effect on a card or a player. */
        delayed: (anchor: undefined | BaseCard | Player, options: DelayedOptions) => node(delayedAction(anchor, options, false)),
        /** "After each time X, do Y": a delayed effect that stays after it triggers. */
        eachTime: (anchor: undefined | BaseCard | Player, options: DelayedOptions) => node(delayedAction(anchor, options, true)),

        /** A replacement effect: cancel the triggering event and resolve these effects instead. */
        instead: (effects: readonly EffectNode[]) =>
            node(GameActions.cancel({ replacementGameAction: GameActions.multiple(nodeActions(effects)) })),

        /** "Initiate a duel – resolve the duel. <consequences>": resolves a duel that the targets initiated. */
        resolveDuel: (duel: undefined | DuelChoice, consequences: Consequences, options: DuelOptions = {}) =>
            node(duel ? duelAction(duel.type, duel.challenger, duel.challenged, consequences, options) : undefined),
        /** "Your character challenges that character to a military duel": a duel that starts in the effect. */
        militaryDuel: (challenger: undefined | DrawCard, challenged: undefined | DrawCard, consequences: Consequences, options: DuelOptions = {}) =>
            node(duelAction('military', challenger, challenged, consequences, options)),
        /** "Your character challenges that character to a political duel": a duel that starts in the effect. */
        politicalDuel: (challenger: undefined | DrawCard, challenged: undefined | DrawCard, consequences: Consequences, options: DuelOptions = {}) =>
            node(duelAction('political', challenger, challenged, consequences, options)),
        /** "Your character challenges that character to a glory duel": a duel that starts in the effect. */
        gloryDuel: (challenger: undefined | DrawCard, challenged: undefined | DrawCard, consequences: Consequences, options: DuelOptions = {}) =>
            node(duelAction('glory', challenger, challenged, consequences, options)),

        /** Hantei XXXVIII: the player of this ability chooses the targets of that ability. */
        chooseTargetsInstead: (abilityContext: undefined | AbilityContext) =>
            node(abilityContext
                ? GameActions.handler({ handler: () => (abilityContext.choosingPlayerOverride = context.player) })
                : undefined),

        /** Cancel the triggering event or effect. */
        cancel: () => {
            // RRG, The Mirror's Gaze: an event that cancels cannot be mirrored.
            (context.ability as { cannotBeMirrored?: boolean }).cannotBeMirrored = true;
            return node(GameActions.cancel());
        },

        lastingEffect: (cards: Many<BaseCard>, build: Mods<'card'>, options: LastingOptions = {}) =>
            node(
                GameActions.cardLastingEffect({
                    target: target(cards),
                    effect: mods(build),
                    ...duration(options.until)
                })
            ),
        playerLastingEffect: (player: undefined | Player, build: Mods<'player'>, options: LastingOptions = {}) =>
            node(
                player
                    ? GameActions.playerLastingEffect({
                        targetController: player,
                        effect: mods(build),
                        ...duration(options.until)
                    })
                    : undefined
            ),

        /** "X may do Y". The player decides when this effect resolves. */
        may: (player: undefined | Player, effect: EffectNode, options: MayOptions) => {
            const action = EffectNode.actionOf(effect);
            return node(player && action ? new MayAction(player, action, options) : undefined);
        },

        /** "You may pay X to Y". The player decides when this effect resolves. */
        mayPay: (player: undefined | Player, payment: ($payment: PayKit) => Payment, effect: EffectNode) =>
            node(player
                ? new MayPayAction(player, payment(createPayKit(player)), EffectNode.actionOf(effect), EffectNode.descriptionOf(effect))
                : undefined),

        /**
         * "Resolve this ability again" or "your opponent may resolve this ability". With `twice`, a
         * resolution that is already the second one does nothing.
         */
        resolveThisAbility: (options: { player?: Player; twice?: boolean } = {}) => {
            if(options.twice && context.subResolution) {
                return node(undefined);
            }
            // In a "then" step, `context.ability` is the step. The card ability is on the triggering context.
            const root = context.triggeringContext;
            const action = GameActions.resolveAbility({
                target: root.source,
                ability: root.ability as CardAbility,
                subResolution: true,
                player: options.player,
                choosingPlayerOverride: root.choosingPlayerOverride ?? undefined
            });
            return new EffectNode(action, context, 'resolve this ability again');
        },

        /**
         * "Honor one of those characters and dishonor the other". `announce` prints when each card has
         * its role.
         */
        assign: <C extends BaseCard, R extends string>(
            cards: readonly C[],
            roles: Record<R, (card: C) => EffectNode>,
            options: Omit<AssignOptions, 'pick' | 'onAssigned'> & {
                pick?: NoInfer<R>;
                announce?: ($message: MessageKit, assigned: Record<NoInfer<R>, C>) => MessageSpec;
            } = {}
        ) => {
            const { announce, ...assignOptions } = options;
            return node(new AssignAction(
                cards,
                Object.fromEntries(
                    Object.entries<(card: C) => EffectNode>(roles).map(([role, build]) => [
                        role,
                        (card: BaseCard) => EffectNode.actionOf(build(card as C))
                    ])
                ),
                {
                    ...assignOptions,
                    onAssigned: announce
                        ? (assigned) =>
                            context.game.addMessage('{0}', formatted(context.game, announce(messageKit, assigned as Record<R, C>)))
                        : undefined
                }
            ));
        },

        /**
         * The effect for the option chosen with `$target.select`. Only this effect decides whether an
         * option can be chosen, so other effects in the list do not make every option legal.
         */
        forChoice: <K extends string>(choice: undefined | K, branches: Record<K, EffectNode>) => {
            const action = choice === undefined ? undefined : EffectNode.actionOf(branches[choice]);
            return node(action ? markChoiceBranch(action) : undefined);
        },

        /** "If X, Y" inside one effect. */
        if: (condition: boolean, effect: EffectNode) => (condition ? effect : node(undefined)),
        /** "..., if able. Otherwise, ..." */
        ifAble: (effect: EffectNode) => ({
            otherwise: (otherwise: EffectNode) =>
                node(
                    GameActions.ifAble({
                        ifAbleAction: EffectNode.actionOf(effect) ?? never(),
                        otherwiseAction: EffectNode.actionOf(otherwise) ?? never()
                    })
                )
        })
    };
}

export type EffectKit = ReturnType<typeof createEffectKit>;
