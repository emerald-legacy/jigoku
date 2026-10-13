// Type tests for the ability builder: checked by `tsc -p tsconfig.test.json`, never run.
import type DrawCard from '../../server/game/DrawCard.js';
import type { ProvinceCard } from '../../server/game/ProvinceCard.js';
import type Ring from '../../server/game/Ring.js';
import type Player from '../../server/game/Player.js';
import type { ResolvedDuel } from '../../server/game/Duel.js';
import type { AbilityContext } from '../../server/game/AbilityContext.js';
import type { AbilityBuilder } from '../../server/game/AbilityBuilder.js';
import { CardType, DuelType, Location, Phase, TargetMode } from '../../server/game/Constants.js';
import { msg } from '../../server/game/GameChat.js';
import { captureCost } from '../../server/game/cards/captureCost.js';
import type * as GameActions from '../../server/game/GameActions/GameActions.js';
import {
    bow,
    chooseAmount,
    honor,
    noAction,
    placeFate,
    selectAttackedProvince,
    selectCard,
    triggerAbility
} from '../../server/game/GameActions/GameActions.js';

/** `expectType<T>()(value)`: value is a T, and not `any` (which would pass every check). */
function expectType<T>(): <V extends T>(value: 0 extends 1 & V ? never : V) => void {
    return () => undefined;
}

// every entry of the shortcut properties map is a builder shortcut and a game action
type Shortcut = keyof GameActions.ActionProps<AbilityContext>;
export const builderShortcutsCovered: Shortcut extends keyof AbilityBuilder<AbilityContext> ? true : false = true;
export const gameActionsCovered: Shortcut extends keyof typeof GameActions ? true : false = true;

export function builderTypeTests(card: DrawCard, province: ProvinceCard): void {
    // cardType decides the class of the chosen card
    card.action('Province target')
        .target({ cardType: CardType.Province }, bow())
        .chatText((context) => {
            expectType<ProvinceCard>()(context.target);
            return msg`${context.target}`;
        });
    card.action('Character target')
        .target({ cardType: CardType.Character }, bow())
        .chatText((context) => {
            expectType<DrawCard>()(context.target);
            return msg`${context.target}`;
        });

    // an optional target may be skipped
    card.action('Optional target')
        .target({ cardType: CardType.Character, optional: true }, bow())
        .chatText((context) => {
            // @ts-expect-error: nothing may have been chosen
            expectType<DrawCard>()(context.target);
            return msg`${context.target}`;
        });

    // targetCards holds a list, which isn't mirrored onto context.target
    card.action('Several cards')
        .targetCards({ cardType: CardType.Character, mode: TargetMode.UpTo, numCards: 2 }, bow())
        .chatText((context) => {
            expectType<DrawCard[]>()(context.targets.target);
            // @ts-expect-error: only a single card is mirrored
            expectType<DrawCard[]>()(context.target);
            return msg`${context.targets.target}`;
        });

    // named targets: a dependent target sees the earlier one, the earlier one doesn't see the later one
    card.action('Named targets')
        .target({
            name: 'first',
            cardType: CardType.Character,
            cardCondition: (_card, context) => {
                // @ts-expect-error: 'second' is chosen later
                expectType<ProvinceCard>()(context.targets.second);
                return true;
            }
        })
        .target({
            name: 'second',
            dependsOn: 'first',
            cardType: CardType.Province,
            cardCondition: (_card, context) => {
                expectType<DrawCard>()(context.targets.first);
                return true;
            }
        }, bow())
        .chatText((context) => {
            expectType<DrawCard>()(context.targets.first);
            expectType<ProvinceCard>()(context.targets.second);
            return msg`${context.targets.first}`;
        });

    // select labels
    card.action('Select')
        .select({}, { A: bow(), B: honor() })
        .chatText((context) => {
            expectType<'A' | 'B'>()(context.select);
            // @ts-expect-error: not a label
            expectType<'C'>()(context.select);
            return msg`${context.select}`;
        });

    // a ring target
    card.action('Ring')
        .ringTarget({ ringCondition: (ring) => ring.isUnclaimed() }, noAction())
        .chatText((context) => {
            expectType<Ring>()(context.ring);
            return msg`${context.ring}`;
        });

    // cost results
    card.action('Cost result')
        .cost(captureCost('chosenProvince', () => province))
        .chatText((context) => {
            expectType<ProvinceCard | undefined>()(context.costs.chosenProvince);
            return msg`${context.player}`;
        });

    // a following step keeps the targets
    card.action('Then')
        .target({ cardType: CardType.Character }, bow())
        .then()
        .honor((context) => {
            expectType<DrawCard>()(context.target);
            return { target: context.target };
        });

    // action-only settings
    card.action('Action').phase(Phase.Conflict).evenDuringDynasty();
    const reaction = card.reaction('Reaction').when({ afterConflict: () => true });
    // @ts-expect-error: actions only
    reaction.phase(Phase.Conflict);

    // province-only settings
    province.action('Province action').canTriggerOutsideConflict();
    // @ts-expect-error: provinces only
    card.action('Character action').canTriggerOutsideConflict();

    // ability-level settings don't belong to a step
    const step = card.action('Step').draw().then();
    // @ts-expect-error: the ability's own setting
    step.phase(Phase.Conflict);

    // cancel() needs an event to cancel
    card.wouldInterrupt('Interrupt')
        .when({ onCardLeavesPlay: () => true })
        .cancel();
    // @ts-expect-error: an action has no triggering event
    card.action('Action').cancel();

    // the event of a trigger
    card.reaction('Event')
        .when({ onCardLeavesPlay: (event) => event.card === card })
        .chatText((context) => {
            expectType<DrawCard>()(context.event.card);
            return msg`${context.event.card}`;
        });

    // selectCard's action may depend on the chosen card
    card.action('Select province')
        .selectAttackedProvince({
            gameAction: (chosen) => {
                expectType<ProvinceCard>()(chosen);
                return triggerAbility({ ability: chosen.abilities.actions[0] });
            }
        });
    selectCard({
        cardType: CardType.Character,
        location: Location.PlayArea,
        gameAction: (chosen) => {
            expectType<DrawCard>()(chosen);
            return bow();
        }
    });
    selectAttackedProvince({
        // @ts-expect-error: a province, not a character
        gameAction: (chosen: DrawCard) => bow({ target: chosen })
    });

    // chooseAmount
    chooseAmount({
        activePromptTitle: 'How many?',
        max: 3,
        gameAction: (amount) => {
            expectType<number>()(amount);
            return placeFate({ amount });
        }
    });

    // callbacks inside a shortcut's properties get the ability's typed context
    card.action('Callbacks')
        .target({ cardType: CardType.Province }, noAction())
        .deckSearch({
            cardCondition: (_card, context) => {
                expectType<ProvinceCard>()(context.target);
                return true;
            },
            message: (context) => {
                expectType<ProvinceCard>()(context.target);
                return msg`${context.target}`;
            }
        })
        .lookAt({
            message: (context) => {
                expectType<ProvinceCard>()(context.target);
                return msg`${context.target}`;
            }
        })
        .cardLastingEffect({
            condition: (context) => {
                expectType<ProvinceCard>()(context.target);
                return true;
            },
            chatText: (context) => msg`${context.target}`
        })
        .atEndOfConflict({
            gameAction: bow(),
            onlyIf: (context) => {
                expectType<ProvinceCard>()(context.target);
                return true;
            }
        })
        .optional({
            activePromptTitle: 'Bow?',
            gameAction: bow(),
            acceptMessage: (context) => {
                expectType<ProvinceCard>()(context.target);
                return msg`${context.target}`;
            }
        });

    // a duel's game action gets a duel with a winner
    card.action('Duel')
        .initiateDuel(() => ({
            type: DuelType.Military,
            gameAction: (duel) => {
                expectType<ResolvedDuel>()(duel);
                expectType<Player>()(duel.winningPlayer);
                expectType<DrawCard[]>()(duel.winner);
                // @ts-expect-error: a loser can be missing
                expectType<DrawCard[]>()(duel.loser);
                return honor({ target: duel.winner });
            }
        }));
}
