import { msg } from './GameChat.js';
import { CardType, EffectName, EventName, Phase, Players, Blocker, RestrictionType } from './Constants.js';
import { ReduceableFateCost } from './costs/ReduceableFateCost.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { PlayIntoLocation } from './PlayCharacterAction.js';
import { AbilityContext } from './AbilityContext.js';
import Player from './Player.js';
import type { Cost, Result } from './costs/Cost.js';
import type { Event } from './Events/Event.js';

/** The character the disguised one replaces, once chosen. */
function chosenCharacter(context: AbilityContext): DrawCard | undefined {
    const card = context.costs.chooseDisguisedCharacter;
    return card instanceof BaseCard && card.isDrawCard() ? card : undefined;
}

function ChooseDisguisedCharacterCost(intoConflictOnly: PlayIntoLocation) {
    return {
        canPay(context: AbilityContext<DrawCard>) {
            return context.player.cardsInPlay.some((card) =>
                context.source.canDisguise(card, context, !!intoConflictOnly)
            );
        },
        resolve(context: AbilityContext<DrawCard>, results: Result) {
            return context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character to replace',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card: BaseCard) => card.isDrawCard() && context.source.canDisguise(card, context, !!intoConflictOnly),
                context: context,
                onSelect: (_player: Player, card: BaseCard) => {
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
            context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions(RestrictionType.SpendFate, context))
        );
    }

    getReducedCost(context: AbilityContext<DrawCard>) {
        const replaced = chosenCharacter(context);
        if(replaced) {
            return Math.max(super.getReducedCost(context) - (replaced.getCost() ?? 0), 0);
        }
        return super.getReducedCost(context);
    }
}

export class PlayDisguisedCharacterAction extends PlayCardSourceAction {
    public title = 'Play this character with Disguise';

    constructor(
        card: DrawCard,
        private intoLocation = PlayIntoLocation.Any
    ) {
        super(card, [ChooseDisguisedCharacterCost(intoLocation), new DisguisedReduceableFateCost(false)]);
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []): Blocker {
        if(!ignoredBlockers.includes(Blocker.WrongPhase) && context.game.currentPhase !== Phase.Conflict) {
            return Blocker.WrongPhase;
        } else if(
            !ignoredBlockers.includes(Blocker.WrongLocation) &&
            !context.player.isCardInPlayableLocation(context.source, context.playType)
        ) {
            return Blocker.WrongLocation;
        } else if(
            !ignoredBlockers.includes(Blocker.CannotTrigger) &&
            !context.source.canPlay(context, context.playType)
        ) {
            return Blocker.CannotTrigger;
        } else if(context.source.anotherUniqueInPlay(context.player)) {
            return Blocker.DuplicateUnique;
        } else if(!context.player.checkRestrictions(RestrictionType.EnterPlay, context)) {
            return Blocker.CannotPlaceFate;
        }
        return super.meetsRequirements(context, ignoredBlockers);
    }

    public executeHandler(context: AbilityContext<DrawCard>) {
        const legendaryFate = context.source.sumEffects(EffectName.LegendaryFate);
        let extraFate = context.source.sumEffects(EffectName.GainExtraFateWhenPlayed);
        if(!context.source.checkRestrictions(RestrictionType.PlaceFate, context)) {
            extraFate = 0;
        }
        extraFate = extraFate + legendaryFate;
        const status = context.source.getEffects(EffectName.EntersPlayWithStatus)[0];
        const events: Event[] = [createCardPlayedEvent(context, context.source, context.playType)];
        const replacedCharacter = chosenCharacter(context);
        if(!replacedCharacter) {
            return;
        }
        const frameworkKeepsDisguisedInCurrentLocation = context.game.rules.disguiseKeepsCharactersInSameLocation;
        const conflictOnly =
            this.intoLocation === PlayIntoLocation.Conflict ||
            (frameworkKeepsDisguisedInCurrentLocation && replacedCharacter.isParticipating());

        let intoConflict = conflictOnly && this.intoLocation !== PlayIntoLocation.Home;
        if(replacedCharacter.inConflict && !conflictOnly) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                options: [{ text: 'Conflict', handler: () => (intoConflict = true) }, { text: 'Home', handler: () => true }]
            });
        }
        context.game.queueSimpleStep(() => {
            context.game.addMessage(msg`${context.player} plays ${context.source}${intoConflict ? ' into the conflict' : ''} using Disguised, choosing to replace ${replacedCharacter}`);
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
