import { msg } from './GameChat.js';
import { CardType, EffectName, EventName, Phase, Players, Blocker, RestrictionType } from './Constants.js';
import { ReduceableFateCost } from './costs/ReduceableFateCost.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { PlayIntoLocation } from './PlayCharacterAction.js';
import { getExtraFateWhenPlayed, getPlayBlocker } from './playActionHelpers.js';
import type { AbilityContext } from './AbilityContext.js';
import type { Cost, Result } from './costs/Cost.js';
import type { Event } from './Events/Event.js';
import { attach, discardFromPlay, moveStatusToken, placeFate, putIntoConflict, putIntoPlay } from './GameActions/GameActions.js';

/** A character played into the conflict can only replace a participating character. */
function replacesParticipatingOnly(intoLocation: PlayIntoLocation): boolean {
    return intoLocation === PlayIntoLocation.Conflict;
}

function ChooseDisguisedCharacterCost(intoLocation: PlayIntoLocation) {
    return {
        canPay(context: AbilityContext<DrawCard>) {
            return context.player.cardsInPlay.some((card) =>
                context.source.canDisguise(card, context, replacesParticipatingOnly(intoLocation))
            );
        },
        resolve(context: AbilityContext<DrawCard>, results: Result) {
            return context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character to replace',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => context.source.canDisguise(card, context, replacesParticipatingOnly(intoLocation)),
                context: context,
                onSelect: (_player, card) => {
                    context.disguisedCharacter = card;
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
    constructor(private intoLocation: PlayIntoLocation) {
        super(false);
    }

    override canPay(context: AbilityContext<DrawCard>) {
        const maxCharacterCost = Math.max(
            ...context.player.cardsInPlay.map((card) =>
                context.source.canDisguise(card, context, replacesParticipatingOnly(this.intoLocation)) ? (card.getCost() ?? 0) : 0
            )
        );
        const minCost = Math.max(context.player.getMinimumCost(context.playType, context) - maxCharacterCost, 0);
        return (
            context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions(RestrictionType.SpendFate, context))
        );
    }

    override getReducedCost(context: AbilityContext<DrawCard>) {
        const replaced = context.disguisedCharacter;
        if(replaced) {
            return Math.max(super.getReducedCost(context) - (replaced.getCost() ?? 0), 0);
        }
        return super.getReducedCost(context);
    }
}

export class PlayDisguisedCharacterAction extends PlayCardSourceAction {
    public override title = 'Play this character with Disguise';

    constructor(
        card: DrawCard,
        private intoLocation = PlayIntoLocation.Any
    ) {
        super(card, [ChooseDisguisedCharacterCost(intoLocation), new DisguisedReduceableFateCost(intoLocation)]);
    }

    public override meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []): Blocker {
        if(!ignoredBlockers.includes(Blocker.WrongPhase) && context.game.currentPhase !== Phase.Conflict) {
            return Blocker.WrongPhase;
        }
        const blocker = getPlayBlocker(context.source, context, ignoredBlockers, context.playType);
        if(blocker) {
            return blocker;
        }
        if(!context.player.checkRestrictions(RestrictionType.EnterPlay, context)) {
            return Blocker.CannotPlaceFate;
        }
        return super.meetsRequirements(context, ignoredBlockers);
    }

    public override executeHandler(context: AbilityContext<DrawCard>) {
        const extraFate = getExtraFateWhenPlayed(context.source, context);
        const status = context.source.getEffects(EffectName.EntersPlayWithStatus)[0];
        const events: Event[] = [createCardPlayedEvent(context, context.source, context.playType)];
        const replacedCharacter = context.disguisedCharacter;
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
                ? putIntoConflict({ target: context.source, fate: extraFate, status })
                : putIntoPlay({ target: context.source, fate: extraFate, status });
            gameAction.addEventsToArray(events, context);
            events.push(
                context.game.getEvent(EventName.Unnamed, {}, () => {
                    const moveEvents: Event[] = [];
                    placeFate({
                        target: context.source,
                        origin: replacedCharacter,
                        amount: replacedCharacter.fate
                    })
                        .addEventsToArray(moveEvents, context);
                    for(const attachment of replacedCharacter.attachments) {
                        attach({ target: context.source, attachment: attachment, viaDisguised: true })
                            .addEventsToArray(moveEvents, context);
                    }
                    for(const token of replacedCharacter.statusTokens) {
                        moveStatusToken({ target: token, recipient: context.source })
                            .addEventsToArray(moveEvents, context);
                    }
                    moveEvents.push(
                        context.game.getEvent(EventName.Unnamed, {}, () => {
                            context.game.checkGameState(true);
                            context.game.openThenEventWindow(
                                discardFromPlay({ cannotBeCancelled: true })
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

    public override isCardPlayed() {
        return true;
    }

    public override isKeywordAbility() {
        return true;
    }
}
