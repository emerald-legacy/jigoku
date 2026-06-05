import { GameModes } from '../GameModes.js';
import { CardType, EffectName, EventName, Phases, Players } from './Constants.js';
import { ReduceableFateCost } from './costs/ReduceableFateCost.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { AbilityContext } from './AbilityContext.js';
import Player from './Player.js';
import type { Cost } from './costs/Cost.js';
import type { Event } from './Events/Event.js';

function ChooseDisguisedCharacterCost(intoConflictOnly: PlayDisguisedCharacterIntoLocation) {
    return {
        canPay(context: AbilityContext<DrawCard>) {
            return (context.player.cardsInPlay as BaseCard[]).some((card) =>
                context.source.canDisguise(card as DrawCard, context, !!intoConflictOnly)
            );
        },
        resolve(context: AbilityContext<DrawCard>, results: any) {
            return context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character to replace',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card: BaseCard) => context.source.canDisguise(card as DrawCard, context, !!intoConflictOnly),
                context: context,
                onSelect: (player: Player, card: BaseCard) => {
                    context.costs.chooseDisguisedCharacter = card;
                    return true;
                },
                onCancel: () => {
                    results.cancelled = true;
                    return true;
                }
            });
        },
        pay() {
            return true;
        }
    };
}

class DisguisedReduceableFateCost extends ReduceableFateCost implements Cost {
    canPay(context: AbilityContext<DrawCard>) {
        const maxCharacterCost = Math.max(
            ...context.player.cardsInPlay.map((card) =>
                context.source.canDisguise(card, context, false) ? (card.getCost() ?? 0) : 0
            )
        );
        const minCost = Math.max(context.player.getMinimumCost(context.playType, context) - maxCharacterCost, 0);
        return (
            context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context))
        );
    }

    getReducedCost(context: AbilityContext<DrawCard>) {
        if(context.costs.chooseDisguisedCharacter) {
            return Math.max(super.getReducedCost(context) - ((context.costs.chooseDisguisedCharacter as DrawCard).getCost() ?? 0), 0);
        }
        return super.getReducedCost(context);
    }
}

export enum PlayDisguisedCharacterIntoLocation {
    Any,
    Conflict,
    Home
}

export class PlayDisguisedCharacterAction extends PlayCardSourceAction {
    public title = 'Play this character with Disguise';

    constructor(
        card: DrawCard,
        private intoLocation = PlayDisguisedCharacterIntoLocation.Any
    ) {
        super(card, [ChooseDisguisedCharacterCost(intoLocation), new DisguisedReduceableFateCost(false)]);
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []): string {
        if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Conflict) {
            return 'phase';
        } else if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, context.playType)
        ) {
            return 'location';
        } else if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !context.source.canPlay(context, context.playType)
        ) {
            return 'cannotTrigger';
        } else if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        } else if(!context.player.checkRestrictions('enterPlay', context)) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    public executeHandler(context: AbilityContext<DrawCard>) {
        const legendaryFate = context.source.sumEffects(EffectName.LegendaryFate);
        let extraFate = context.source.sumEffects(EffectName.GainExtraFateWhenPlayed);
        if(!context.source.checkRestrictions('placeFate', context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const status = context.source.getEffects(EffectName.EntersPlayWithStatus)[0];
        const events = [
            context.game.getEvent(EventName.OnCardPlayed, {
                player: context.player,
                card: context.source,
                context: context,
                originalLocation: context.source.location,
                originallyOnTopOfConflictDeck:
                    context.player &&
                    context.player.conflictDeck &&
                    context.player.conflictDeck[0] === context.source,
                onPlayCardSource: context.onPlayCardSource,
                playType: context.playType
            })
        ];
        const replacedCharacter = context.costs.chooseDisguisedCharacter as DrawCard;
        if(!replacedCharacter) {
            return;
        }
        const frameworkKeepsDisguisedInCurrentLocation =
            context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
        const conflictOnly =
            this.intoLocation === PlayDisguisedCharacterIntoLocation.Conflict ||
            (frameworkKeepsDisguisedInCurrentLocation && replacedCharacter.isParticipating());

        let intoConflict = conflictOnly && this.intoLocation !== PlayDisguisedCharacterIntoLocation.Home;
        if(replacedCharacter.inConflict && !conflictOnly) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [() => (intoConflict = true), () => true]
            });
        }
        context.game.queueSimpleStep(() => {
            context.game.addMessage(
                '{0} plays {1}{2} using Disguised, choosing to replace {3}',
                context.player,
                context.source,
                intoConflict ? ' into the conflict' : '',
                replacedCharacter
            );
            const gameAction = intoConflict
                ? context.game.actions.putIntoConflict({ target: context.source, fate: extraFate, status })
                : context.game.actions.putIntoPlay({ target: context.source, fate: extraFate, status });
            gameAction.addEventsToArray(events, context);
            events.push(
                context.game.getEvent(EventName.Unnamed, {}, () => {
                    const moveEvents: Event[] = [];
                    context.game.actions
                        .placeFate({
                            target: context.source,
                            origin: replacedCharacter,
                            amount: replacedCharacter.fate
                        })
                        .addEventsToArray(moveEvents, context);
                    for(const attachment of replacedCharacter.attachments) {
                        context.game.actions
                            .attach({ target: context.source, attachment: attachment, viaDisguised: true })
                            .addEventsToArray(moveEvents, context);
                    }
                    for(const token of replacedCharacter.statusTokens) {
                        context.game.actions
                            .moveStatusToken({ target: token, recipient: context.source })
                            .addEventsToArray(moveEvents, context);
                    }
                    moveEvents.push(
                        context.game.getEvent(EventName.Unnamed, {}, () => {
                            context.game.checkGameState(true);
                            context.game.openThenEventWindow(
                                context.game.actions
                                    .discardFromPlay({ cannotBeCancelled: true })
                                    .getEvent(replacedCharacter, context)
                            );
                        })
                    );
                    context.game.openThenEventWindow(moveEvents);
                })
            );
            context.game.openEventWindow(events);
        });
    }

    public isCardPlayed() {
        return true;
    }

    public isKeywordAbility() {
        return true;
    }
}
